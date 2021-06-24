---
nav:
  title: 系统
  order: 3
group:
  title: 进程
  order: 1
title: 集群 cluster
order: 3
---

# 集群

Node 实例是单线程作业的。在服务端编程中，通常会创建多个 Node 实例来处理客户端的请求，以此提升系统的吞吐率。对这样多个 Node 实例，我们称之为 Cluster（集群）。

借助 Node.js 的 `cluster` 模块，开发者可以在几乎不修改原有项目代码的前提下，获得集群服务带来的好处。

集群有以下两种常见的实现方案：

**方案一：多个 Node 实例+多个端口**

集群内的 Node.js 实例，各自监听不同的端口，再由反向代理实施请求到多个端口的分发。

- 优点：实现简单，各实例相对独立，这对服务稳定性有好处
- 缺点：增加端口占用，进程之间通信比较麻烦

**方案二：主进程向子进程转发请求**

集群内，创建一个主进程（master），以及若干个子进程（worker）。由 `master` 监听客户端连接请求，并根据特定的策略，转发至对应的 `worker`。而这种方案为 Node.js 的 `cluster` 模式所使用。

- 优点：通常只占用一个端口，通信相对简单，转发策略更灵活
- 缺点：实现相对复杂，对主进程的稳定性要求较高

## 集群创建

Cluster 是常见的 Node.js 利用多核的方法，它是基于 `child_process.fork()` 实现的，所以 `cluster` 产生的进程之间是通过 [IPC](ipc.md) 来通信的，并且它也没有拷贝父进程的空间，而是通过加入 `cluster.isMaster` 这个标识，来区分父进程以及子进程，达到类似 POSIX 的 fork 的效果。

```js
const cluster = require('cluster');            // | |
const http = require('http');                  // | |
const numCPUs = require('os').cpus().length;   // | |    都执行了
                                               // | |
if (cluster.isMaster) {                        // |-|-----------------
  // Fork workers.                             //   |
  for (var i = 0; i < numCPUs; i++) {          //   |
    cluster.fork();                            //   |
  }                                            //   | 仅父进程执行 (master.js)
  cluster.on('exit', (worker) => {             //   |
    console.log(`${worker.process.pid} died`); //   |
  });                                          //   |
} else {                                       // |-------------------
  // Workers can share any TCP connection      // |
  // In this case it is an HTTP server         // |
  http.createServer((req，res) => {            // |
    res.writeHead(200);                        // |   仅子进程执行 (worker.js)
    res.end('Hello world!');                   // |
  }).listen(8000);                             // |
}                                              // |-------------------
                                               // | |
console.log('Hello world!');                   // | |    都执行了
```

在上述代码中 `numCPUs` 虽然是全局变量但是，在父进程中修改它，子进程中并不会改变，因为父进程与子进程是完全独立的两个空间。他们所谓的共有仅仅只是都执行了，并不是同一份。

你可以把父进程执行的部分当做 `master.js`，子进程执行的部分当做 `worker.js`，你可以把他们想象成是先执行了 `node master.js` 然后 `cluster.fork` 了几次，就执行了几次 `node worker.js`。而 cluster 模块则是二者之间的一个桥梁，你可以通过 cluster 提供的方法，让其二者之间进行沟通交流。

## 运作原理

了解 cluster 模块，主要需要搞清楚三个问题：

1. master 和 `worker` 如何通信？
2. 多个 server 实例，如何实现端口共享？
3. 多个 server 实例，来自客户端的请求如何分发到多个 worker？

### 进程间通信

> `master` 和 `worker` 如何通信？

`master` 进程通过 `cluster.fork()` 来创建 `worker` 进程。`cluster.fork()` 内部是通过`child_process.fork()` 方法创建的。

也就是说：

1. `master` 进程和 `worker` 进程是父子进程的关系
2. `master` 进程和 `worker` 进程可以通过 IPC 通道进行通信相互传递服务句柄 📌

### 端口共享

> 多个 `server` 实例，如何实现端口共享？

在前面的例子中，多个 `worker` 中创建的 `server` 监听了相同的端口 3000。通常来说，多个进程监听同个端口，系统会报错。

那么为什么我们的示例没问题呢？

这是因为在 net 模块中，会根据当前进程是 `master` 进程还是 `worker` 进程，对 `listen()` 方法进行了特殊处理：

1. `master` 进程：在该端口上正常监听请求（没做特殊处理）
2. `worker` 进程：创建 Server 实例。然后通过 IPC 通道，向 `master` 进程发送消息，让 `master` 进程页创建 server 实例，并在该端口上监听请求。当请求进来时，`master` 进程将请求转发给 worker 进程的 server 实例。

归纳起来，就是：`master` 进程监听特定端口，并将客户请求转发给 `worker` 进程。

```jsx | inline
import React from 'react';
import img from '../../assets/process/cluster-run-flow.png';

export default () => <img alt="Cluster模块运行流程" src={img} width={640} />;
```

### 分发连接

> 多个 `server` 实例，来自客户端的请求如何分发到多个 `worker`？

每当 `worker` 进程创建 `server` 实例来监听请求，都会通过 IPC 通道，在 `master` 上进行注册。当客户端请求到达，`master` 会负责将请求转发给对应的 `worker`。

具体转发给哪个 `worker`？这是由转发策略决定的。可以通过环境变量 `NODE_CLUSTER_SCHED_POLICY` 设置，也可以在 `cluster.setupMaster(options)` 时传入。

cluster 模块提供了两种分发连接的方式。

第一种方式（默认方式，不适用于 Windows），通过**时间片轮转法**（round-robin）分发连接。主进程监听端口，接收到新连接之后，通过时间片轮转法来决定将接收到的客户端的 Socket 句柄传递给指定的 `worker` 处理。至于每个连接由哪个 `worker` 来处理，完全由内置的循环算法决定。

第二种方式是由主进程创建 `socket` 监听端口后，将 socket 句柄直接分发给相应的 `worker`，然后当连接进来时，就直接由相应的 `worker` 来接收连接并处理。

使用第二种方式时理论上性能应该较高，然而时间上存在负载不均衡的问题，比如通常 70% 的连接仅被 8 个进程中的 2 个处理，而其他进程比较清闲。

## 集群的可伸缩性策略

Node.js 中的伸缩性是融合到运行时核心的特性。Node 被命名为 Node 是为了强调 Node 应用应该包含多个相互之间通信的小型分布式节点。

Node.js 的 `cluster` 模块不仅提供了充分利用机器 CPU 内核开箱即用的解决方案，还有助于 Node 进程增加可用性的能力，另外还提供了一个选项：无停机重启整个应用的能力。

工作量是我们扩展应用的最普遍的理由，但同时我们也通过扩展应用增加可用性和容灾能力。

实际上，主要通过以下三种策略提高应用的可伸缩性。

### 克隆

扩展大型应用最简单的方法就是多次克隆并且克隆实例处理负载的一部分（例如使用负载均衡器）。并不会花费太多的开发事件并且非常有效。策略就是做最小化的事情并且 Node.js 有内置模块 `cluster`，在服务器上面实现一个克隆策略非常容易。

### 分解

我们可以基于功能和服务通过分解扩展一个应用。这意味着用不同的代码实现多样的应用，有时候有专属的数据库和用户界面。

这种策略通常与 **微服务（Microservice）** 有关，**微**指的是这些服务应该尽可能地小，但是实际上，最重要的不是服务的大小，而是服务之间的松耦合和高内聚。这个策略的实现并不容易并且可能导致长期的出乎意料的问题，但是做好之后，有点还是非常大的。

### 拆分

我们可以将应用分成多个实例，每个实例负责应用数据的一部分。这个策略是在数据库上 **水平切分（horizontal paritioning）**，或者**分区（sharding）**。数据分区在每个操作使用哪个应用实例之前需要有一个查找的步骤。例如也许我们通过用户的国家和语言进行分区，那么我们就需要一个数据信息的查找。

## 内部通信技巧

在开发过程中，我们会通过 `process.on('message', fn)` 来实现进程间通信。

前面提到，master 进程、worker 进程在 server 实例的创建过程中，也是通过 IPC 通道进行通信的。那会不会对我们的开发造成干扰呢？比如，收到一堆其实并不需要关心的信息？

答案肯定是不会，那么是怎么实现的呢？

当发送的消息包含 `cmd` 字段，且改字段以 `NODE_` 作为前缀，则该消息会被视为内部包括保留的消息，不会通过 `message` 事件抛出，但可以通过监听 `internalMessage` 捕获。

```js
// worker 进程
const message = {
  cmd: 'NODE_CLUSTER',
  act: 'queryServer',
};

process.send(message);
```

---

**参考资料：**

- [📝 node-learning-guide: cluster](https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/cluster.md)
- [📝 腾讯 AlloyTeam：解读 Node.js 的 cluster 模块](http://www.alloyteam.com/2015/08/nodejs-cluster-tutorial/)
- [📝 猫眼前端：深入浅出 Node.js Cluster](https://mp.weixin.qq.com/s/Xm_c841UdKA06s76rJ_4nw)
- [📝 Node.js 集群（cluster）：扩展你的 Node.js 应用](https://zhuanlan.zhihu.com/p/36728299)
- [📝 Node.js：浅析高并发与分布式集群](https://zhuanlan.zhihu.com/p/41118827)
- [📝 淘宝前端：当我们谈论 cluster 时我们在谈论什么](https://fed.taobao.org/blog/2015/11/04/nodejs-cluster/)
- [📝 Node.js cluster 模块深入研究](https://www.cnblogs.com/accordion/p/7207740.html)

---

- [理解 Node.js 中的多线程](https://zhuanlan.zhihu.com/p/74879045)
- [深入理解 Node.js 进程与线程](https://zhuanlan.zhihu.com/p/77733656)
- [多进程 & Node.js Web 实现](https://zhuanlan.zhihu.com/p/165131406)
- [Node.js 集群（Cluster）：扩展你的 Node.js 应用](https://zhuanlan.zhihu.com/p/36728299)
- [Node.js Cluster 模块深入研究](https://zhuanlan.zhihu.com/p/28319632)
- [Node.js 源码阅读：多进程架构的演进之路与 eggjs 多进程架构实践](https://zhuanlan.zhihu.com/p/34912873)
- [EggCluster 是如何解决多进程模式下相关问题的](https://zhuanlan.zhihu.com/p/128066894)
- [Node 多进程的创建与维护](https://zhuanlan.zhihu.com/p/100550801)
- [nodejs 创建线程问题](https://zhuanlan.zhihu.com/p/181729061)
- [Nodejs 单线程为什么能支持高并发？](https://zhuanlan.zhihu.com/p/61807318)
- [如何解决 nodejs 中 cpu 密集型的任务](https://zhuanlan.zhihu.com/p/220478526)
- [Node.js 真·多线程 Worker Threads 初探](https://zhuanlan.zhihu.com/p/52455566)
- [Node 黑魔法之无痛用线上多线程](https://zhuanlan.zhihu.com/p/35353355)

# 进程

深入理解 Node.js 中的进程与线程

https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md#process

- 进程
- 线程
- Node.js 进程与线程
  - process
  - 多进程实现
    - cluster
    - child_process
    - Node.js 进程通信原理与句柄传递机制讲解
    - 自己实现 Node.js 多进程架构模型
  - 进程守护
  - 线程
    - 单线程误区
    - 多线程创建
  - Linux 实现进程关闭

## 进程与线程

### 进程概念

进程 `Process` 是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础，进程是线程的容器。

进程是资源分配的最小单位。我们启动一个服务、运行一个实例，就是开一个服务进程，例如 Java 里的 JVM 本身就是一个进程，Node.js 里通过 `node app.js` 开启一个服务进程，多进程就是进程的复制（fork），fork 出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。

### 线程概念

线程是操作系统能够进行运算调度的最小单位，首先我们要清楚线程是隶属于进程的，被包含于进程之中。**一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的**。

#### 单线程

**单线程就是一个进程只开一个线程**

Javascript 就是属于单线程，程序顺序执行（这里暂且不提 JavaScript 异步），可以想象一下队列，前面一个执行完之后，后面才可以执行，当你在使用单线程语言编码时切勿有过多耗时的同步操作，否则线程会造成阻塞，导致后续响应无法处理。你如果采用 Javascript 进行编码时候，请尽可能的利用 Javascript 异步操作的特性。

**单线程的一些说明**

- Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销。
- 当你的项目中需要有大量计算，CPU 耗时的操作时候，要注意考虑开启多进程来完成了。
- Node.js 开发过程中，错误会引起整个应用退出，应用的健壮性值得考验，尤其是错误的异常抛出，以及进程守护是必须要做的。
- 单线程无法利用多核 CPU，但是后来 Node.js 提供的 API 以及一些第三方工具相应都得到了解决，文章后面都会讲到。

## Node.js 中的进程与线程

Node.js 是 Javascript 在服务端的运行环境，构建在 Chrome 的 V8 引擎之上，基于事件驱动、非阻塞 I/O 模型，充分利用操作系统提供的异步 I/O 进行多任务的执行，适合于 I/O 密集型的应用场景，因为异步，程序无需阻塞等待结果返回，而是基于回调通知的机制，原本同步模式等待的时间，则可以用来处理其它任务，

> 科普：在 Web 服务器方面，著名的 Nginx 也是采用此模式（事件驱动），避免了多线程的线程创建、线程上下文切换的开销，Nginx 采用 C 语言进行编写，主要用来做高性能的 Web 服务器，不适合做业务。

Web 业务开发中，如果你有高并发应用场景那么 Node.js 会是你不错的选择。

在单核 CPU 系统之上我们采用 `单进程 + 单线程` 的模式来开发。在多核 CPU 系统之上，可以通过 `child_process.fork` 开启多个进程（Node.js 在 v0.8 版本之后新增了 Cluster 模块来实现多进程架构） ，即 `多进程 + 单线程` 模式。

⚠️ **注意**：开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能。

### Node.js 中的进程

Node.js 中的进程 Process 是一个全局对象，无需 `require` 则可直接使用，给我们提供了当前进程中的相关信息。官方文档提供了详细的说明，感兴趣的可以亲自实践下 [Process](https://nodejs.org/dist/latest-v12.x/docs/api/process.html) 文档。

#### 进程创建

进程创建有多种方式，主要使用 Node.js 的另外两个模块：[child_process](./child-process.md) 模块和 [cluster](./cluster.md) 模块。

##### child_process 模块

`child_process` 是 Node.js 的内置模块，用于创建子进程。

几个常用函数： 四种方式：

- `child_process.spawn()`：适用于返回大量数据，例如图像处理，二进制数据处理。
- `child_process.exec()`：适用于小量数据，maxBuffer 默认值为 200 \* 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
- `child_process.execFile()`：类似 `child_process.exec()`，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为
- `child_process.fork()`： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通常根据系统 **CPU 核心数**设置。

CPU 核心数这里特别说明下，fork 确实可以开启多个进程，但是并不建议衍生出来太多的进程，CPU 核心数的获取方式 `const cpus = require('os').cpus();` 这里 `cpus` 返回一个对象数组，包含所安装的每个 CPU/内核的信息，二者总和的数组。假设主机装有两个 CPU，每个 CPU 有 4 个核，那么总核数就是 8。

##### cluster 模块

Cluster 模块调用 fork 方法来创建子进程，该方法与 `child_process` 中的 fork 是同一个方法。 Cluster 模块采用的是经典的**主从模型**，Cluster 会创建一个 master，然后根据你指定的数量复制出多个子进程，可以使用 `cluster.isMaster` 属性判断当前进程是 master 还是 worker（工作进程）。由 master 进程来管理所有的子进程，主进程不负责具体的任务处理，主要工作是负责调度和管理。

Cluster 模块使用内置的负载均衡来更好地处理线程之间的压力，该负载均衡使用了 `Round-robin` 算法（也被称之为循环算法）。当使用 Round-robin 调度策略时，master `accepts()` 所有传入的连接请求，然后将相应的 TCP 请求处理发送给选中的工作进程（该方式仍然通过 IPC 来进行通信）。

开启多进程时候端口疑问讲解：如果多个 Node 进程监听同一个端口时会出现 `Error:listen EADDRIUNS` 的错误，而 cluster 模块为什么可以让多个子进程监听同一个端口呢？原因是 master 进程内部启动了一个 TCP 服务器，而真正监听端口的只有这个服务器，当来自前端的请求触发服务器的 connection 事件后，master 会将对应的 socket 句柄发送给子进程。

#### 进程通信原理

前面讲解的无论是 child_process 模块，还是 cluster 模块，都需要主进程和工作进程之间的通信。通过 `fork()` 或者其他 API，创建子进程之后，为了实现父子进程之间的通信，父子进程之间才能通过 `message` 和 `send()` 传递信息。

IPC 这个词我想大家并不陌生，不管那一种开发语言之遥提到进程通信，都会提到它。IPC 的全称是 Inter-Process Communication，即进程间通信。它的目的是为了让不同的进程能够互相访问资源并进行协调工作。实现进程间通信的技术有很多，如命名管道、匿名管道、Socket、信号量、共享内存、消息队列等。Node 中实现 IPC 通道是依赖于 libuv。Window 下由命名管道（name pipe）实现，\*nix 系统则采用 Unix Domain Socket 实现。表现在应用层上的进程间通信只有简单的 message 事件和 `send()` 方法，接口十分简洁和消息化。

<img src="../snapshots/ipc-creation.png" style="zoom:80%;" />

IPC 通信管道是如何创建的：

<img src="../snapshots/ipc-pipe-creation.jpeg" style="zoom:80%;" />

父进程在实际创建子进程之前，会创建 IPC 通道并监听它，然后才真正的创建出子进程，这个进程中也会通过环境变量（NODE_CHANNEL_FD）告诉子进程这个 IPC 通道的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已存在的 IPC 通道，从而完成父子进程之间的连接。

#### 句柄传递

讲句柄之前，先想一个问题，`send()` 句柄发送的时候，真的是将服务器对象发送给子进程？

**子进程对象 send 方法可以发送的句柄类型**

- `net.Socket`：TCP 套接字
- `net.Server`：TCP 服务器，任意建立在 TCP 服务上的应用层服务都可以享受它带来的好处
- `net.Native`：C++ 层面的 TCP 套接字或 IPC 管道
- `dgram.Socket`：UDP 套接字
- `dgram.Native`：C++ 层面的 UDP 套接字

**send 句柄发送原理分析**

结合句柄的发送与还原示意图更容易理解。

<img src="../snapshots/send-handle.jpeg" style="zoom:80%;" />

`send()` 方法在将消息发送到 IPC 管道前，实际将消息组装成了两个对象，一个参数是 hadler，另一个是 message。message 参数如下所示：

```js
{
  cmd: 'NODE_HANDLE',
  type: 'net.Server',
  msg: message
}
```

发送到 IPC 管道中的实际上是我们要发送的句柄文件描述符。这个 message 对象在写入到 IPC 管道时，也会通过 `JSON.stringfy()` 进行序列化。所以最终发送到 IPC 通道中的信息都是字符串，`send()` 方法能发送消息和句柄并不意味着它能发送任何对象。

连接了 IPC 通道的子线程可以读取父进程发来的消息，将字符串通过 `JSON.parse()` 解析还原为对象后，才触发 message 事件将消息传递给应用层使用。在这个过程中，消息对象还要被进行过滤处理，`message.cmd` 的值如果以 `NODE_` 为前缀，它将响应一个内部事件 `internalMessage`，如果 `message.cmd` 值为 NODE_HANDLE，它将取出 `message.type` 值和得到的文件描述符一起还原出一个对应的对象。

以发送的 TCP 服务器句柄为例，子进程收到消息后的还原过程代码如下：

```js
function(message,handle,emit){
    var self = this;

    var server = new net.Server();
    server.listen(handler,function(){
      emit(server);
    });
}
```

这段还原代码，子进程根据 `message.type` 创建对应的 TCP 服务器对象，然后监听到文件描述符上。由于底层细节不被应用层感知，所以子进程中，开发者会有一种服务器对象就是从父进程中直接传递过来的错觉。

> Node 进程之间只有消息传递，不会真正的传递对象，这种错觉是抽象封装的结果。目前 Node 只支持我前面提到的几种句柄，并非任意类型的句柄都能在进程之间传递，除非它有完整的发送和还原的过程。

#### 多进程架构模型

以下通过代码实现多进程架构模型示例：

<img src="../snapshots/mutiprocess-architecture.png" style="zoom:80%;" />

**主进程：**

`master.js` 主要处理以下逻辑：

- 创建一个 Server 并监听 3000 端口
- 根据系统 CPUS 开启多个子进程
- 通过子进程对象的 send 方法发送消息到子进程进行通信
- 在主进程中监听了子进程的变化，如果是自杀信号重新启动一个工作进程
- 主进程在监听到退出消息的时候，先退出子进程再退出主进程

```js
// master.js
const fork = require('child_process').fork;
const cpus = require('os').cpus();

const server = require('net').createServer();
server.listen(3000);
process.title = 'node-master';

const workers = {};
const createWorker = () => {
  const worker = fork('worker.js');
  worker.on('message', function(message) {
    if (massage.act === 'suicide') {
      createWorker();
    }
  });
  worker.on('exit', function(code, signal) {
    console.log('worker process exited, code: %s signal: %s', code, signal);
    delete workers[worker.pid];
  });
  worker.send('server', server);
  workers[worker.pid] = worker;
  console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
};

for (let i = 0; i < cpus.length; i++) {
  createWorker();
}

process.once('SIGINT', close.bind(this, 'SIGINT')); // kill(2) Ctrl-C
process.once('SIGQUIT', close.bind(this, 'SIGQUIT')); // kill(3) Ctrl-\
process.once('SIGTERM', close.bind(this, 'SIGTERM')); // kill(15) default
process.once('exit', close.bind(this));

function close(code) {
  console.log('进程退出', code);

  if (code !== 0) {
    for (let pid in workers) {
      console.log('master process exited, kill worker pid:', pid);
      workers[pid].kill['SIGINT'];
    }
  }

  process.exit(0);
}
```

**子进程：**

`worker.js` 子进程处理逻辑如下：

- 创建一个 Server 对象，注意这里最开始并没有监听 3000 端口
- 通过 message 事件接收主进程 send 方法发送的消息
- 监听 uncaughtException 事件，捕获未处理的异常，发送自杀信息由主进程重建进程，子进程在链接关闭之后退出

```js
// worker.js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('I am worker, pid:' + process.pid + ', ppid:' + process.ppid);
  // 测试异常进程退出、重启
  throw new Error('worker process exception!');
});

let worker;
process.title = 'node-worker';
process.on('messsage', function(message, sendHandle) {
  if (message === 'server') {
    worker = sendHandle;
    worker.on('connection', function(socket) {
      server.emit('connection', socket);
    });
  }
});

process.on('uncaguhtException', function(err) {
  console.log(err);
  process.send({ act: 'suicide' });
  worker.close(function() {
    process.exit(1);
  });
});
```

#### 进程守护

**什么是进程守护？**

每次启动 Node.js 程序都需要在命令窗口输入命令 `node app.js` 才能启动，但如果把命令窗口关闭则 Node.js 程序服务就会立刻断掉。除此之外，当我们这个 Node.js 服务意外奔溃了就不能自动重启进程了。这些现象都不是我们想要看到的，所以需要通过某些方式来守护这个开启的进程，执行 `node app.js` 开启一个服务进程之后，我们还可以在这个终端上做些别的事情，且不会相互影响，当出现问题可以自动重启。

**如何实现进程守护**

这里只说一些第三方的进程守护框架，[pm2](https://pm2.keymetrics.io/) 和 [forever](https://github.com/foreversd/forever#readme)，它们都可以实现进程守护，底层也都是通过上面讲的 child_process 模块和 cluster 模块实现的，这里就不再提它们的原理。

#### Linux 关闭进程

通过 Linux 命令查找进程

```bash
ps aux | grep server
```

杀死进程

```bash
# 优雅的方式
# -l 选项告诉 kill 命令用好像启动进程的用户已注销的方式结束进程
# 当使用该选项时，kill 命令也试图杀死所留下的子进程
# 但这个命令也不是总能成功，或许仍然需要先手工杀死子进程，然后再杀死父进程
kill -l [PID]

# kill 命令用于终止进程
# -9 表示强迫进程立即停止
kill -9 [PID]

# 杀死同一进程内的所有进程
# 其允许指定要终止的进程名称，而非 PID
killall httpd
```

### 线程




## 经典面试题

面试常问：

- Node.js 是单线程吗？
- Node.js 做好事的计算时候，如何避免阻塞？
- Node.js 如何实现多进程的开启和关闭？
- Node.js 可以创建线程吗？
- 你们开发过程中如何实现进程守护的？
- 除了使用第三方模块，你们自己是否封装过一个多进程架构？
- 进程的当前工作目录是什么？有什么作用？
- child_process.fork 与 POISX 的 fork 有什么区别？
- 父进程或子进程的死亡是否会影响对方？什么是孤儿进程？
- cluster 是如何保证负载均衡的？
- 什么是守护进程？如何实现守护进程？
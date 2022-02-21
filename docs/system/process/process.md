---
nav:
  title: 系统
  order: 3
group:
  title: 进程
  order: 1
title: 进程 process
order: 1
---

# 进程 process

关于进程（Process），我们需要讨论的是两个概念：

1. 操作系统的进程
2. Node.js 中的 [`process`](http://nodejs.cn/api/process.html) 对象

## 进程与线程

### 进程概念

**进程（Process）** 是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的 **基本单位**，是操作系统结构的基础，进程是 **线程的容器**。

我们启动一个服务、运行一个实例，就是开一个服务进程，例如 Java 里的 JVM 本身就是一个进程，Node.js 里通过 `node app.js` 开启一个服务进程，多进程就是进程的复制（fork），`fork` 出来的每个进程都拥有自己的 **独立空间地址** 和 **数据栈**，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 [IPC](https://zh.wikipedia.org/wiki/%E8%A1%8C%E7%A8%8B%E9%96%93%E9%80%9A%E8%A8%8A) 进程间通信，进程之间才可进行数据共享。

### 线程概念

**线程**是操作系统能够进行运算调度的最小单位。

首先我们要清楚 **线程是隶属于进程** 的，被包含于进程之中。**一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的**。

```jsx | inline
import React from 'react';
import img from '../../assets/process/process-and-thread.png';

export default () => <img alt="进程与线程" src={img} width={720} />;
```

<br />

| 进程                                                               | 线程                                                       |
| :----------------------------------------------------------------- | :--------------------------------------------------------- |
| 进程有代码/数据/堆和其他段                                         | 线程没有数据段和堆                                         |
| 进程中必须至少有一个线程                                           | 线程不能独立生存，必须在存在与进程中                       |
| 进程中的线程共享代码/数据/堆，共享 I/O，但是它们有各自的堆和寄存器 | 一个进程可以有多个线程，第一个线程调用 main 并拥有进程堆栈 |
| 难创建难切换                                                       | 易创建易切换                                               |
| 如果一个进程挂了，它的资源会被回收，所有线程都会挂                 | 如果一个线程挂了，那么它的堆栈将被回收                     |

#### 单线程

**单线程就是一个进程只开一个线程**

JavaScript 就是属于单线程，程序顺序执行（这里暂且不提 JavaScript 异步），可以想象一下队列，前面一个执行完之后，后面才可以执行，当你在使用单线程语言编码时切勿有过多耗时的同步操作，否则线程会造成阻塞，导致后续响应无法处理。你如果采用 JavaScript 进行编码时候，请尽可能的利用 JavaScript 异步操作的特性。

**单线程说明：**

- Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销。
- 当你的项目中需要有大量计算，CPU 耗时的操作时候，要注意考虑开启多进程来完成了。
- Node.js 开发过程中，错误会引起整个应用退出，应用的健壮性值得考验，尤其是错误的异常抛出，以及进程守护是必须要做的。
- 单线程无法利用多核 CPU，但是后来 Node.js 提供的 API 以及一些第三方工具相应都得到了解决。

## 进程事件

| 进程事件                   | 说明 | 版本 |
| :------------------------- | :--- | :--- |
| `message`                  |      |      |
| `beforeExit`               |      |      |
| `disconnect`               |      |      |
| `exit`                     |      |      |
| `multipleResolves`         |      |      |
| `rejectionHandled`         |      |      |
| `uncaughtException`        |      |      |
| `uncaughtExceptionMonitor` |      |      |
| `unhandledRejection`       |      |      |
| `warning`                  |      |      |
| `worker`                   |      |      |

## 信号事件

当 Node.js 进程收到信号时，则将触发信号事件。

| 信号事件 | 说明 |
| :------- | :--- |
|          |      |
|          |      |
|          |      |
|          |      |
|          |      |

## 参考资料

- [📖 饿了么大前端 Node.js 面试指南](https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md#process)
- [📝 淘宝前端团队 Cluster 讲解](http://taobaofed.org/blog/2015/11/03/nodejs-cluster/)
- [📝 理解 Node.js 中的多线程](https://zhuanlan.zhihu.com/p/74879045)

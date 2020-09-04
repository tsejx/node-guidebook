---
nav:
  title: 概览
  order: 1
group:
  title: 架构
  order: 1
title: 运行机制
order: 3
---

# 运行机制

依赖的各种库：

- v8
- libuv
- zlib

libuv 架构

* Network I/O
  * TCP
  * UDP
  * TTY
  * Pipe
* uv_io_t
* epoll
* kqueue
* event ports
* IOCP
* File I/O
* DNS Ops
* User code
* Thread Pool 线程池

NodeJS 是单进程单线程的，Libuv 并不是单线程，它依赖一个伴随Node.js 启动而初始化的线程池来实现。

---

**参考资料：**

- [📝 结合源码分析 Node.js 模块加载与运行原理]() 知乎
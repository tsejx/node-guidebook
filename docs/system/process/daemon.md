---
nav:
  title: 系统
  order: 3
group:
  title: 进程
  order: 1
title: 守护进程
order: 5
---

# 守护进程

守护进程是后台运行不受终端控制的进程（如输入、输出等），一般的网络服务都是以守护进程的方式运行。

## 原因

守护进程脱离终端的主要原因两点：

1. 用户启动守护进程的终端在启动守护进程之后，需要执行其他任务
2. 如其他用户登录该终端后，以前的守护进程的错误信息不应出现，由终端上的一些键所产生的信号（如中断信号），不应以前从该终端上启动的任何守护进程造成影响

## 实现方式

### 实现步骤

1. 父进程通过 `fork` 等方法创建子进程
2. 在子进程中创建新回话（调用系统函数 setsid）
3. 改变子进程工作目录（如：`"/"` 或 `"/usr"` 等）
4. 父进程终止，子进程由 init 进程接管

### setsid 详解

`setsid` 主要完成三件事：

1. 该进程完成一个新会话的会话领导
2. 该进程编程一个进程组的组长
3. 该进程没有控制终端

然而，Nodejs 中并没有对 `setsid` 方法的直接封装，翻阅文档发现有一个地方是可以调用该方法的。

### 实现过程

```js
const spawn = require('child_process').spawn;
let server = null;

function startServer() {
  console.log('restart server');

  server = spawn('node', ['app.js']);
  console.log('node js pid is' + server.pid);

  server.on('close', function(code, signal) {
    server.kill(signal);
    server = startServer();
  });

  server.on('error', function(code, signal) {
    server.kill(signal);
    server = startServer();
  });

  return server;
}

startServer();
```

- [守护进程实现（Node.js 版本）](https://cnodejs.org/topic/57adfadf476898b472247eac)
- [守护进程实现（C 语言版本）](https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md#%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)

## 守护进程总结

在实际工作中对于守护进程并不陌生，例如 PM2、Egg-Cluster 等，以上只是一个简单的 Demo 对守护进程做了一个说明，在实际工作中对守护进程的健壮性要求还是很高的，例如：进程的异常监听、工作进程管理调度、进程挂掉之后重启等等，这些还需要我们去不断思考。
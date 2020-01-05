# 多进程架构模型

多进程架构解决了单进程、单线程无法充分利用系统多核 CPU 的问题。

下面通过一个例子实现多进程架构批量启动 Node.js 进程服务。

## 主进程

- 创建 Server 并监听指定端口（例如：3000）
- 根据系统 `cpus` 开启多个子进程
- 通过子进程对象的 `send` 方法发消息到子进程进行通信
- 在主进程中监听子进程的变化，如果是自杀信号重新启动一个工作进程
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
    if (message.act === 'suicide') {
      createWorker();
    }
  });
  worker.on('exit', function(code, signal) {
    console.log('worker process exited, code: %s signal: %s', code, signal);
    delete workers[worker.pid];
  });
  worker.on('server', server);
  workers[worker.pid] = worker;
  console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
};

for (let i = 0; i < cpus.length; i++) {
  createWorker();
}

// kill(2) Ctrl+C
process.once('SIGINT', close.bind(this, 'SIGINT'));
// kill(3) Ctrl+\
process.once('SIGQUIT', close.bind(this, 'SIGQUIT'));
// kill(15) default
process.once('SIGTERM', close.bind(this, 'SIGTERM'));
process.once('exit', close.bind(this));

function close(code) {
  console.log('进程退出！', code);

  if (code !== 0) {
    for (let pid in workers) {
      console.log('master process exited, kill worker pid:', pid);
      workers[pid].kill('SIGINT');
    }
  }

  process.exit(0);
}
```

## 子进程

- 创建 Server 对象，不用监听端口
- 通过 `message` 事件接收主进程 `send` 方法发送的消息
- 监听 `uncaughtException` 事件，捕获未处理的异常，发送自杀信息由主进程重建进程，子进程在链接关闭之后退出

```js
// worker.js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('I am worker, pid:' + process.pid + ', ppid:' + process.ppid);

  throw new Error('worker process exception!');
  // 测试异常进程退出、重建
});

let worker;
process.title = 'node-worker';
process.on('message', function(message, sendHandle) {
  if (message === 'server') {
    worker = sendHandle;
    worker.on('connection', function(socket) {
      server.emit('connection', socket);
    });
  }
});

process.on('uncaughtException', function(err) {
  console.log(err);
  process.send({ act: 'suicide' });
  worker.close(function() {
    process.exit(1);
  });
});
```

以上示例简单地介绍了多进程创建、异常监听、重启等，但是作为企业级应用程序我们还需要考虑的更完善，例如：进程的重启次数限制、与守护进程结合、多进程模式下定时任务处理等。推荐看阿里 [Egg.js 多进程模式](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)

## 状态共享

> 多进程或多个 Web 服务之间的状态共享问题？

多进程模式下各个进程之间是相互独立的，例如用户登录之后 session 的保存，如果保存在服务进程里，那么如果我有 4 个工作进程，每个进程都要保存一份是没必要的，假设服务重启了数据也会丢失。多个 Web 服务也是一样的，还会出现我在 A 机器上创建了 Session，当负载均衡分发到 B 机器上之后还需要再创建一份。一般的做法是通过 Redis 或者数据库来做数据共享。

---

**参考资料：**

- [📝 浅谈 Node.js 多进程服务架构基本原理](https://www.cnblogs.com/tugenhua0707/p/11141076.html)
- [📖 Egg.js 多进程模型和进程间通讯](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)

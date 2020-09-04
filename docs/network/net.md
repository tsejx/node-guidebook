---
nav:
  title: 网络
  order: 4
title: Net 网络
order: 3
---

# Net

net 模块提供了用于底层网络通信的工具，包含创建服务器/客户端的方法。

若传输的数据交互不通过 HTTP 协议，则可以使用 net 模块，如 WebSocket。

HTTP 协议本质上是以文本形式传输数据，它的传输数据量较大，而且它的传输需要二进制和文本之间进行转换和解析。

在 NodeJS 中，http 模块是继承自 net 模块的。

从组成来看，net 模块主要包含两部分：

- net.Server：TCP Server，内部通过 socket 来实现与客户端的通信
- net.Socket：TCP/本地 socket 的 Node 版实现，它实现了全双工的 Stream 接口

## 服务端 net.Server

net.Server 通常用于创建一个 TCP 或本地服务器。

### 相关事件

通过 `net.createServer()` 创建的服务器为 EventEmitter 实例，它的定义事件有如下几种：

- `listening`：当调用 `server.listen()` 绑定服务器之后触发
- `connection`：当新的连接建立时触发。socket 是一个 `net.Socket` 实例。
- `close`：当服务器关闭时触发。如果连接存在，直到所有的连接结束才会触发该事件。
- `error`：当服务器发生异常时触发。不同于 `net.Socket`，`close` 事件不会在该事件触发后继续触发，除非 `server.close()` 是手动调用。

### server.listen

#### 端口监听

监听指定端口 port 和 主机 host ac 连接。 默认情况下 host 接受任何 IPv4 地址（INADDR_ANY）的直接连接。端口 port 为 0 时，则会分配一个随机端口。

```js
server.listen(port[,host][,backlog][,callback])
```

#### 路径监听

通过指定路径（path）的连接，启动一个本地 socket 服务器。

```js
server.listen(path[, callback])
```

#### 句柄监听

通过指定句柄连接。

```js
server.listen(handle[,backlog][,callback])
```

#### 配置监听

options 的属性：

- 端口 port
- 主机 host
- backlog
- callback 回调函数（可选参数）

相当于调用 `server.listen(port,[host],[backlog],[callback])`。还有，参数 path 可以用来指定 UNIX socket。

```js
server.listen(options[, callback])
```

### server.close

```js
server.close([callback]);
```

关闭服务器，停止接收新的客户端请求。

- 对正在处理中的客户端请求，服务端会等待它们处理完（或超时），然后再正式关闭
- 正常关闭的同时，`callback` 会被执行，同时会触发 `close` 事件
- 异常关闭的同时，`callback` 也会执行，同时将对应的 `error` 作为参数传入。（比如还没调用 `server.listen(port)` 之前），就调用了 `server.close()`

## 客户端 net.Socket

### 相关事件

服务器可以同时与多个客户端保持连接，对于每个连接而言是典型的可写可读 Stream 对象。Stream 对象可以用于服务器端和客户端之间的通信，既可以通过 `data` 事件从一端读取另一端发来的数据，也可以通过 `write()` 方法从一端向另一端发送数据。它具有如下自定义事件：

- **connect**：当客户端与服务端成功建立链接之后触发，如果链接不上服务器直接抛出 error 事件错误然后退出 Node 进程。
- **data**：当客户端收到服务器传送过来的数据或者是客户端传送给服务器的数据的时候触发回调。
- **end**：当另外一侧发送 FIN 包断开的时候触发，默认情况下 (`allowHalfOpen == false`)，socket 会自我销毁（如果写入待处理队列里面还没正式响应回包），但是我们可以设置 `allowHalfOpen` 参数为 `true`，这样可以继续往该 socket 里面写数据，但是我们需要自己去调用 `end` 方法去消耗这个 socket，不然可能会造成句柄泄漏。
- **close**：链接断开的时候触发，但是如果在传输的过程中有错误的话这里会在回调函数里面抛出 `error`。
- **timeout**：socket 超时空闲的时候触发，如果要在队列里面销毁需要手动去调 close 方法。
- **lookup**：域名解析完成的时候触发。
- **drain**：写完缓存的时候触发，可使用在上传大小限制中。
- **ready**：socket 准备好使用时触发
- **error**：当发生异常时触发该事件

### 相关方法

- **address()**：获取服务绑定的 socket 的 IP 地址，返回对象有三个属性，分别为端口（port）、绑定地址（address）以及 IPvX 版本（family）。
- **connect()**：在给定的套接字上启动一个连接。该方法是异步的。当建立的时候，`connect` 事件将会被触发。如果连接中出现问题，`error` 事件将会代替 `connect` 事件被触发，并将错误信息传递给 `error` 监听器。最后一个 `connectListener`，如果指定了，将会被添加为 `connect` 事件的监听器。
  - **connect(options[,connectListener])**
  - **connect(path[,connectListener])**：用于 IPC 连接
  - **connect(port[,host][,connectlistener])**：用于 TCP 连接
- **write(data[,encoding][,callback])**：服务端给客户端发送数据或者是客户端给服务端发送数据。如果全部数据都成功刷新到内核的缓冲则返回 `true`。如果全部或部分数据在用户内中排队，则返回 `false`。当缓冲再次空闲的时候将触发 `drain` 时间。
- **pause()**：暂停读写数据。也就是说，`data` 事件将不会再被触发。可以用作对数据上传限制。
- **resume()**：恢复数据读取。
- **end([data][,encoding][,callback])**：半关闭 socket。例如发送一个 FIN 包，服务器仍然可能发送一些数据。如果指定 `data` 参数，则相当于调用 `socket.write(data, encoding)` 之后再调用 `socket.end()`。
- **destroy([encoding])**：确保在该 socket 上不再有 I/O 活动。仅在出现错误的时候才需要（如解析错误等）。如果制定了 exception，则将会触发一个 `error` 事件，任何监听器都将收到 `exception` 作为一个参数。
- **setEncoding()**：设置数据流的编码格式。
- **setKeepAlive([enable][,initialdelay])**：启用/禁止 keep-alive 长连接功能，并且在第一个长连接探针被发送到一个空闲的 socket 之前可选则配置初始延迟。
- **setNoDelay([noDelay])**：禁止 Nagele 算法，TCP 链接默认使用 Nagle 算法，它们在发送之前数据会被缓存。这是为 `true` 的话在每次 `socket.write()` 的时候会立即发送数据，默认为 `true`。
- **setTimeout(timeout[,callback])**：当一个空闲的 socket 在多少秒后不活跃会被接受到 timeout 事件，但是该 socket 连接不会被断开，需要手动调用 `end()` 或者 `destroy()` 来断开连接。可选的 `callback` 参数将会被当作一个时间监听器被添加到 `timeout` 事件。

### 相关属性

- **bufferSize**：当前缓存的等待被发送的字符串的数量
- **bytesRead**：收到的字节的数量
- **bytesWritten**：发送的字节的数量
- **destroyed**：标识链接是否已经被破坏，一旦被破坏，就不用使用该链接来传输数据
- **localAddress**：远程客户端链接本地地址的 host。如果我们监听的服务的 host 是 `0.0.0.0`，而客户端链接是 `192.168.1.1`，最后的值是后者
- **localPort**：本地的端口
- **remoteAddress**：客户端 IP，如果 socket 已经是 destroyed 的话，该值为 `undefined`
- **remoteFamily**：客户端是 IPvX

## 沾包

默认情况下，TCP 连接会启用延迟传送算法 (Nagle 算法), 在数据发送之前缓存他们。如果短时间有多个数据发送, 会缓冲到一起作一次发送（缓冲大小见 `socket.bufferSize`）, 这样可以减少 I/O 消耗提高性能。

如果是传输文件的话，那么根本不用处理粘包的问题，来一个包拼一个包就好了。但是如果是多条消息，或者是别的用途的数据那么就需要处理粘包。

可以参见网上流传比较广的一个例子，连续调用两次 `send` 分别发送两段数据 `data1` 和 `data2`, 在接收端有以下几种常见的情况：

* A. 先接收到 `data1`, 然后接收到 `data2`
* B. 先接收到 `data1` 的部分数据, 然后接收到 `data1` 余下的部分以及 `data2` 的全部.
* C. 先接收到了 `data1` 的全部数据和 `data2` 的部分数据, 然后接收到了 `data2` 的余下的数据.
* D. 一次性接收到了 `data1` 和 `data2` 的全部数据.

其中的 BCD 就是我们常见的粘包的情况. 而对于处理粘包的问题, 常见的解决方案有:

* 多次发送之前间隔一个等待时间
* 关闭 Nagle 算法
* 进行封包/拆包

**方案一**

只需要等上一段时间再进行下一次 `send` 就好, 适用于交互频率特别低的场景。缺点也很明显，对于比较频繁的场景而言传输效率实在太低。不过几乎不用做什么处理。

**方案二**

关闭 Nagle 算法，在 Node.js 中你可以通过 `socket.setNoDelay()` 方法来关闭 Nagle 算法, 让每一次 `send` 都不缓冲直接发送。

该方法比较适用于每次发送的数据都比较大（但不是文件那么大），并且频率不是特别高的场景。如果是每次发送的数据量比较小，并且频率特别高的，关闭 Nagle 纯属自废武功。

另外，该方法不适用于网络较差的情况，因为 Nagle 算法是在服务端进行的包合并情况，但是如果短时间内客户端的网络情况不好，或者应用层由于某些原因不能及时将 TCP 的数据 `recv`，就会造成多个包在客户端缓冲从而粘包的情况。如果是在稳定的机房内部通信那么这个概率是比较小可以选择忽略的。

**方案三**

封包/拆包是目前业内常见的解决方案了。即给每个数据包在发送之前，于其前/后放一些有特征的数据，然后收到数据的时候根据特征数据分割出来各个数据包。

## 可靠传输

为每一个发送的数据包分配一个序列号（SYN, Synchronize packet），每一个包在对方收到后要返回一个对应的应答数据包（ACK, Acknowledgement）。发送方如果发现某个包没有被对方 ACK，则会选择重发。接收方通过 SYN 序号来保证数据的不会乱序（reordering），发送方通过 ACK 来保证数据不缺漏，以此参考决定是否重传。关于具体的序号计算, 丢包时的重传机制等可以参见阅读陈皓的 [《TCP的那些事儿（上）》](http://coolshell.cn/articles/11564.html) 此处不做赘述。

## 基本用法

### 创建 Socket 服务器

创建 TCP 服务器，可以通过构造函数和工厂方法实现，两者都会返回一个 `net.Server` 类，可接收两个可选参数。

- 构造函数：`new net.Server`
- 工厂方法：`net.createServer()`

```js
const net = require('net');

const server = net.createServer();
// const server = new net.Server()

server.on('connection', socket => {
  socket.pipe(process.stdout);
  socket.write('data from server');
});

server.listen(3000, () => {
  console.log(`server is on ${JSON.stringify(server.address())}`);
});
```

在 listen 监听的时候没有指定端口的话会自动随意监听一个端口，创建完成一个 TCP 服务器后，使用 `tenlent 0.0.0.0 3000`，链接后可与服务器进行数据通信。通过 `createServer` 实例化一个服务后，服务会去监听客户端请求，与客户端建立了链接之后会在回调里面抛出建链的 `net.Socket` 对象。

Server 对象的特点：

- `createServer` 是 `new net.Server` 的语法糖
- Server 对象继承了 EventEmitter，具有事件的相关方法
- `_handle` 时 Server 处理的句柄，属性值最终由 C++ 部分的 `TCP` 和 `Pipe` 类创建
- `connectionListener` 是 connection 事件回调函数的语法糖

### 创建 Socket 客户端

创建一个 TCP 客户端，同样可以采用构造函数和工厂方法实现，创建成功后都会返回一个 `net.Socket` 实例。

- 构造函数：`new net.Socket`
- 工厂方法：`net.createConnection()` -> `net.connect()`

```js
const net = require('net');

const client = net.connect({ port: 3000 });

client.on('connect', () => {
  client.write('data from client');
});

client.on('data', chunk => {
  console.log(chunk.toString());
  client.end();
});
```

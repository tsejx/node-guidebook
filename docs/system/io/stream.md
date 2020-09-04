---
nav:
  title: 系统
  order: 3
group:
  title: 异步 I/O
  order: 2
title: Stream 流
order: 3
---

# 流

流（stream）是 Node.js 中处理流式数据的抽象接口。流也是一种数据传输手段，是有顺序的，有起点和终点的，比如你要把数据从一个地方传到另一个地方。

为什么流那么好用还那么重要呢？

- 因为有时候我们并不需要关心文件的主体内容，只需关心能不能取到数据，取到数据之后怎么进行处理
- 对于小型的文本文件，我们可以把文件内容全部读入内存，然后再写入文件
- 对于体积较大的二进制文件，比如音频、视频等多媒体文件，动辄几个 GB 大小，如果使用常规方法读取，很容易使内存溢出
- 理想的方法应该是读一部分，写一部分，不管文件有多大，只要时间允许，总会处理完成，这里就需要用到流的概念

`stream` 模块是 Node.js 中用于构建实现了流接口的对象。

🌰 **示例**：访问 `stream` 模块

```js
const stream = require('stream');
```

尽管理解流的工作方式很重要，但是 `stream` 模块主要用于开发者创建新类型的流实例。 对于以消费流对象为主的开发者，极少需要直接使用 `stream` 模块。

## 流的类型

在 Node.js 中对文件的处理多数使用流来完成：

- 普通文件
- 设备文件（stdin、stdout）
- 网络文件（http、net）

在 Node.js 中有四种基本的流类型：

- `Writable`（可写流）：可写流是数据可以被写入目标的抽象（例如 `fs.createWriteStream()`）
- `Readable`（可读流）：可读流是数据可以被消费的抽象（例如 `fs.createReadStream()`）
- `Duplex`（双向流）：双向流既是可写的也是可读的（例如 `net.Socket`）
- `Transform`（转换流）：转向流基于双向流，可以在读或写的时候被用来更改或者转换数据（例如 `zlib.createDeflate()` 使用 gzip 算法压缩数据）。可以将转换流想象成一个函数，它的输入是可写流，输出是可读流。某些地方也将转换流称为通过流（through streams）。

```js
const Stream = require('stream');

const Readable = Stream.Readable;
const Writable = Stream.Writable;
const Duplex = Stream.Duplex;
const Transform = Stream.Transform;
```

所有流都是 **EventEmitter** 的实例。触发它们的事件可以读或者写入数据，然而，我们可以使用 `pipe` 方法消费流的数据。

此外，该模块还包括实用函数 `stream.pipeline()`、`stream.finished()` 和 `stream.Readable.from()` 方法。

### 对象模式

Node.js 创建的流都是运作在字符串和 Buffer（或 Uint8Array）上。 当然，流的实现也可以使用其它类型的 JavaScript 值（除了 null）。 这些流会以 `对象模式` 进行操作。

当创建流时，可以使用 `objectMode` 选项把流实例切换到**对象模式**。 将已存在的流切换到对象模式是不安全的。

### 缓冲

`可写流` 和 `可读流` 都会在内部的**缓冲器**中存储数据，可以分别使用的 `writable.writableBuffer` 或 `readable.readableBuffer` 来获取。

可缓冲的数据大小取决于传入流构造函数的 `highWaterMark` 选项。

- 对于普通的流， `highWaterMark` 指定了字节的总数
- 对于对象模式的流， `highWaterMark` 指定了对象的总数

当调用 `stream.push(chunk)` 时，数据会被缓冲在可读流中。 如果流的消费者没有调用 `stream.read()`，则数据会保留在内部队列中直到被消费。

一旦内部的可读缓冲的总大小达到 `highWaterMark` 指定的阈值时，流会暂时停止从底层资源读取数据，直到当前缓冲的数据被消费 （也就是说，流会停止调用内部的用于填充可读缓冲的 `readable._read()`）。

当调用 `writable.write(chunk)` 时，数据会被缓冲在可写流中。 当内部的可写缓冲的总大小小于 `highWaterMark` 设置的阈值时，调用 `writable.write()` 会返回 `true`。 一旦内部缓冲的大小达到或超过 `highWaterMark` 时，则会返回 `false`。

stream API 的主要目标，特别是 `stream.pipe()`，是为了限制数据的缓冲到可接受的程度，也就是读写速度不一致的源头与目的地不会压垮内存。

因为 Duplex 和 Transform 都是可读又可写的，所以它们各自维护着两个相互独立的内部缓冲器用于读取和写入， 这使得它们在维护数据流时，读取和写入两边可以各自独立地运作。 例如，net.Socket 实例是 Duplex 流，它的可读端可以消费从 socket 接收的数据，而可写端则可以将数据写入到 socket。 因为数据写入到 socket 的速度可能比接收数据的速度快或者慢，所以读写两端应该独立地进行操作（或缓冲）。

---

**参考资料：**

- [美团 Node.js Stream - 基础篇](https://tech.meituan.com/2016/07/08/stream-basics.html)
- [美团 Node.js Stream - 进阶篇](https://tech.meituan.com/2016/07/15/stream-internals.html)
- [美团 Node.js Stream - 实战篇](https://tech.meituan.com/2016/07/22/stream-in-action.html)
- [📝 Node.js 流（stream）：你需要知道的一切](https://zhuanlan.zhihu.com/p/36728655)
- [通过源码解析 Node.js 中导流（pipe）的实现](https://cnodejs.org/topic/56ba030271204e03637a3870)
- [想学 Node.js，stream 先有必要搞清楚](https://juejin.im/post/5d25ce36f265da1ba84ab97a)
- [zoubin/streamify-your-node-program：对 Node.js 中 stream 模块的学习积累和理解](https://github.com/zoubin/streamify-your-node-program)
- [想学 Node.js，Stream 先有必要搞清楚](https://juejin.im/post/5d25ce36f265da1ba84ab97a)

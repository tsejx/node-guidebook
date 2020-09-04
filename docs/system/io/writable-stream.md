---
nav:
  title: 系统
  order: 3
group:
  title: 异步 I/O
  order: 2
title: WritableStream 可写流
order: 5
---

# 可写流

可写流（Writable Streams）是对数据写入目的地的一种抽象，用来消费上游流过来的数据，通过可写流程可以把数据写入设备，常见的可写流是本地磁盘文件写入和 TCP、HTTP 等网络响应。

可写流的原理其实与可读流类似，当数据过来的时候会写入缓存池，当写入的速度很慢或者写入暂停时候，数据流便会进入到队列池缓存起来，当然即使缓存池满了，剩余的数据也是存在内存。

在 Node.js 中属于可读流的接口：

- HTTP Request on the client 客户端请求
- HTTP Response on the server 服务器响应
- fs write streams 文件
- zlib streams 压缩
- crypto streams 加密
- TCP sockets TCP 服务器
- child process stdin 子进程标准输入
- process.stdout / process.stderr 标准输出，错误输出

## 实现过程

通过实现简单版的 WritableStream 更好地了解可写流。

1. 通过相关模块接口可以创建 WritableStreams 实例，例如 `fs.createWriteStream`
2. `highWaterMark` 用于设置 WritableStreams 可写缓冲区的大小，默认为 16KB，当 `正在写入数据+缓冲区数据长度` 超过 `highWaterMark` 的值时，会触发 `drain` 事件
3. 可写流 `write` 和 `end` 方法知恩那个写字符串或 Buffer 类型的数据
4. 并行写，顺序不会乱
5. 通过一个字节的缓冲区 `hightWaterMark = 1`，写入一个 10 个数

```js
const EventEmitter = require('events');
const fs = require('fs');

/**
 * 可写流需要考虑并发写的问题，比如并发写时，要确保写的顺序不错乱
 * 为了保证并发写顺序不会乱，WriteStream 创建了一个链表结构缓冲区
 * 用来按顺序缓存待写的内容，等待当前正在写的内容写完，再依次从缓冲区中一个一个读取出来继续写
 */
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

class LinkList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
  append(chunk) {
    let node = new Node(chunk);
    // 链表头
    if (this.head === null) {
    	this.head = node;
    } else {
      // 找到最后一个把当前节点放到后面去
      let current = this.head;
      while(current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.length++;
  }
  get() {
    let head = this.head;
    if (!head) return;
    this.head = head.next;
    this.length--;
    return head.element;
  }
}

module.exports = class WritableStream extends EventEmitter {
  constructor(path, options) {
    super();
    // 写入文件的路径
    this.path = path;
    // 标识，写入文件要做的操作
    this.flags = options.flags || 'w';
    // 水位线，一次可写入缓存中的字节
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    // 写入完毕是否关闭
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.mode = options.mode || 0o666;
    // 编码
    this.encoding = options.encoding || 'utf8';

    // 表示当前是否正在写入
    this._writing = false;
    // 缓冲区，如果当前正在写，就把待写入的内容放到缓冲区中
    this.cache = new LinkList();
    // 只有当前消耗掉了和期望值相等或者大于期望值的时候，设置成 true
    // 当缓存区的内容 + 正在写入的内容超过 highWaterMark 时
    this.needDrain = false;
    // 写入的位置的偏移量
    this.pos = this.start;
    // 打开文件准备写入
    this.open();

    // 用来统计 缓冲区 + 正在写入的内容的个数
    this.len = 0;
  }

  // 只能写字符串或 Buffer 类型的数据
  write(chunk, encoding = this.encoding, callback) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.legn += chunk.length;
    let flag = this.len < this.highWaterMark;

    // 当 len >= highWaterMark 时，设置 needDrain 为 true，需要触发 drain 事件
    this.needDrain = !flag;

    if(this._writing) {
      // 当前正在写，将待写内容保存到缓冲区中
      this.cache.append({
        chunk,
        encoding,
        callback
      });
    } else {
      // 真正的写入逻辑
      this._writing = true;
      this._write(chunk, encoding, () => {
        callback && callback();
        // 从缓冲区中取出一个出来写
        this.clearBuffer();
      })
    }
    // true：没有超过 highWaterMark（可以继续写）
    // false：超过 highWaterMark（不能继续写了）
    return flag;
  }

  clearBuffer() {
    // 依此从链表中取出一个出来写
    let obj = this.cache.get();
    if (obj) {
      this._write(obj.chunk, obj.encoding, () => {
      	obj.callback && obj.callback();
        this.clearBuffer();
      })
    } else {
    	// obj 为 undefined 说明缓冲区已经清空完毕
      this._writing = false;
      if (this.needDrain) {
        // 当 needDrain 为 true 时，需要触发 drain 事件
        	this.needDrain = false;
        	this.emit('drain');
      }
    }
  }

  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      this.fd = fd;
      this.emit('open', fd);
    })
  }

  _write(chunk, encoding, clearBuffer) {
    if (typeof this.fd !== 'number') {
      // 由于 fs.open 操作是异步的，所以这里要保证 fs.open 文件打开完毕，再开始写
      return this.once('open', () => this._write(chunk, encoding, clearBuffer))
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      this.pos += written;
      this.len -= written;
      // 每次写入成功就从缓冲区中依次取出一个出来继续写
      clearBuffer();
    })
  }

  destroy(err) {
    fs.close(this.fd, () => {
      this.emit('close', err);
    }
  }

  // end 相当于 write + close
  end(data) {
    this.write(data, 'utf8', () => {
    	this.destroy();
    });
  }
}
```

关键点分析：

1. WritableStream 需要继承 EventEmitter。比如 `drain`、`close`、`error` 等事件都是基于 EventEmitter 实现的。

2. 构建一个链表结构的缓冲区，这里为什么不采用数组呢，因为在 WritableStream 中，每次都是从缓冲区中取出第一个数据出来写，如果是数组的话，每次 pop 一个数据出来后，需要设计到数组的重排，因此这里采用链表的结构明显性能比较高。

3. 定义一个属性 `_writing` 来保存当前是否正在写的状态，当 `_writing` 为 `true` 时，代表当前正在写入，当 `writing` 为 `false` 时，代表当前没有在写入。

```js
// 表示当前是否正在写入
this._writing = false;
```

4. 可写流的特点就是第一次 `write` 是真正的写，之后的 `write` 会被保存到缓冲区中，等当前的数据写完再从缓冲区中按顺序读出来继续写
5. 定义一个属性 `needDrain`，代表是否需要触发 `drain` 事件。当**缓冲区的长度和正在写入的长度**达到了期望的值 `highWaterMark` 时，设置为 `needDrain` 为 `true`

6. WritableStream 默认会先 `open` 文件

```js
class WritableStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.mode = options.mode || 0o666;
    this.encoding = options.encoding || 'utf8';

    // 表示当前是否正在写入
    this._writing = false;
    // 缓冲区，如果当前正在写，就把待写入的内容放到缓冲区中
    this.cache = new LinkList();
    // 只有当前消耗掉了和期望值相等或者大于期望值的时候，设置成 true
    // 当缓存区的内容 + 正在写入的内容超过 highWaterMark 时
    this.needDrain = false;
    // 写入的位置的偏移量
    this.pos = this.start;
    // 打开文件准备写入
    this.open();

    // 用来统计 缓冲区 + 正在写入的内容的个数
    this.len = 0;
  }

  open() {
      fs.open(this.path, this.flags, (err, fd) => {
      this.fd = fd;
      this.emit('open', fd);
    })
  }
}
```

7. 实现 `write` 方法

所有可写流都需要实现 `stream.Writable` 类定义的接口，`write` 是 `stream.Writable` 的一个方法，在 `write` 方法内部会调用子类（WritableStream）的 `_write`，本文为了方便理解，把 `write` 的逻辑包含在了 WriteStream 中

`write` 主要实现的功能如下：

7-1. 将 chunk 统一转化为 Buffer 类型

7-2. 将 `_writing` 判断当前是否正在写，如果是，将数据存到缓冲区中，否则，调用 `_write` 进行真正的写数据

7-3. `write` 函数返回一个 `flat` 状态，代表目前缓冲区内的数据长度是否小于 `highWaterMark`，是则可以继续写，不是则不能继续写，并且会触发 `drain` 事件

```js
// 只能写 字符串 或 Buffer 类型的数据
write(chunk, encoding = this.encoding, callback) {
  	chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.legn += chunk.length;
    let flag = this.len < this.highWaterMark;

    // 当 len >= highWaterMark 时，设置 needDrain 为 true，需要触发 drain 事件
    this.needDrain = !flag;

    if(this._writing) {
      // 当前正在写，将待写内容保存到缓冲区中
      this.cache.append({
        chunk,
        encoding,
        callback
      });
    } else {
      // 真正的写入逻辑
      this._writing = true;
      this._write(chunk, encoding, () => {
        callback && callback();
        // 从缓冲区中取出一个出来写
        this.clearBuffer();
      })
    }
    // true：没有超过 highWaterMark（可以继续写）
    // false：超过 highWaterMark（不能继续写了）
    return flag;
}
```

8. 实现 `_write` 函数

可写流必须实现 `stream.Writable` 的 `writable._write()` 或 `writable._writev()` 方法。

这里实现 `writable._write()` 方法。

关键点：

8-1. 要确保 `fs.open` 打开成功后拿到 fd 才能开始写

```js
_write(chunk, encoding, clearBuffer) {
  	if (typeof this.fd !== 'number') {
      // 由于 fs.open 操作是异步的，所以这里要保证 fs.open 文件打开完毕，再开始写
      return this.once('open', () => this._write(chunk, encoding, clearBuffer))
    }
}
```

8-2. 当写完此次 chunk 的数据后，需要从缓冲区取出一个出来继续写，直到清空缓冲区里的数据

```js
_write(chunk, encoding, clearBuffer) {
 	if (typeof this.fd !== 'number') {
    // 由于 fs.open 操作是异步的，所以这里要保证 fs.open 文件打开完毕，再开始写
    return this.once('open', () => this._write(chunk, encoding, clearBuffer))
  }

  fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
    this.pos += written;
    this.len -= written
    clearBuffer(); // 每次写入成功就从缓冲区中依次取出一个出来继续写
  });
}

// 依次从链表中取出一个出来写
clearBuffer() {
  let obj = this.cache.get();
  if (obj) {
    this._write(obj.chunk, obj.encoding, () => {
      obj.callback && obj.callback();
      this.clearBuffer();
    })
  } else {
    // obj 为 undefined 说明缓冲区已经清空完毕
    // 表示当前没有在写，下次再调用 write 可以直接向文件中写入
    this._writing = false;
    if (this.needDrain) {
      // 当 needDrain 为 true 时，需要触发 drain 事件
      this.needDrain = false;
      this.emit('drain');
    }
  }
}
```

### 自定义可写流

因为 `createWriteStream` 内部调用了 WriteStream 累，WriteStream 又实现了 Writable 接口，WriteStream 实现了 `_write()` 方法，所以我们通过自定义一个类继承 `stream` 模块的 Writable，并在原型上自定义一个 `_write()` 就可以自定义自己的可写流。

```js
let { Writable } = require('stream');

class MyWrite extends Writable {
  _write(chunk, encoding, callback) {
    // write() 第一个参数，写入的数据
    console.log(chunk);
    // 这个 callback，就相当于我们上面的 clearBuffer 方法，如果不执行 callback 就不会继续从缓存中取出写
    callback();
  }
}

let write = new MyWrite();
write.write('1', 'utf8', () => {
  console.log('ok');
})
```

## 管道流

管道流（pipe），是可读流上的方法，至于为什么放到这里，主要是因为需要 2 个流的基础知识，是可读流配合可写流的一种**传输方式**。如果用原来的读写，因为写比较耗时，所以会多读少写，耗内存，但用了 `pipe` 就不会了，始终用规定的内存。

**用法**

```js
const fs = require('fs');
// pipe 方法叫管道，可以控制速率
let rs = fs.createReadStream('./r.txt', {
  highWaterMark: 4
});
let ws = fs.createWriteStream('./w.txt', {
  highWaterMark: 1
});
// 会监听 rs 的 on('data') 将读取到的数据，通过 ws.write 的方法写入文件
// 调用写的一个方法，返回 boolean 类型
// 如果返回 false 就调用 rs 的 pause 方法，暂停读取
// 等待可写流，写入完毕再监听 drain resume rs
rs.pipe(ws); // 会控制速率，防止淹没可用内存
```

**实现**

```js
const fs = requir('fs');
// 这两个是自定义实现的 ReadStream 和 WriteStream
const ReadStream = require('./ReadStream');
const WriteStream = require('./WriteStream');

// 如果用原来的读写；因为写比较耗时，所以会多读少写，耗内存
ReadStream.prototype.pipe = function(dest){
  this.on('data', (data) => {
    let flag = dest.write(data);
    // 如果写入的时候嘴巴吃满了就不继续读了，暂停
    if (!flag) {
      this.pause();
    }
  })
  // 如果写的时候嘴巴里的吃完了，就会继续读
  dest.on('drain', () => {
    this.resume();
  });
  this.on('end', () => {
    this.destroy();
    // 清空缓存中的数据
    fs.fsync(dest.fd, () => {
      dest.destory();
    })
  })
}
```

---

**参考资料：**

- [Node.js Writable Stream 的实现简析](https://juejin.im/post/5ab4d31ff265da2391480e4b)
- [📝 Node WriteStream 可写流的实现原理](http://www.cxdsimple.com/blog/20191210/5cab01ec.html)
---
nav:
  title: 系统
  order: 3
group:
  title: 异步 I/O
  order: 2
title: TransformStream 转换流
order: 6
---

# 转换流

变换流（Transform Streams）是一种 Duplex 流。它的输出与输入是通过某种方式关联。和所有 Duplex 流一样，变换流同时实现了 Readable 和 Writable 接口。

对于转换流，我们不必实现 `read` 或 `write` 方法，我们只需要实现一个 `transform` 方法，将两者结合起来。它有 `write` 方法的意思，我们也可以用它来 `push` 数据。

变换流的实例包括：

- zlib streams
- crypto streams

```js
const { Transform } = require('stream');
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

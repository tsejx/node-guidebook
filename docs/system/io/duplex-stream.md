---
nav:
  title: 系统
  order: 3
group:
  title: 异步 I/O
  order: 2
title: DuplexStream 双工流
order: 6
---

# 双工流

双工流（Duplex Streams）Duplex 实际上就是继承了 Readable 和 Writable 的一类流。所以，一个 Duplex 对象既可当成可读流来使用（需要实现 `_read` 方法），也可当成可写流来使用（需要实现 `_write` 方法）。

因为它既可读又可写，所以称它又两端：可写端和可读端。可写端的接口与 Wrtiable 一致，作为下游来使用；可读端的接口与 Readable 一致，作为上游来使用。

🌰 **示例：**

```js
rs.pipe(rws1).pipe(rws2).pipe(rws3).pipe(ws);
```

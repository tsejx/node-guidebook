---
nav:
  title: 网络
  order: 4
title: Dgram 数据报
order: 4
---

# Dgram

dgram 模块提供了 UDP 数据包 socket 的实现。

## dgram.Socket

dgram.Socket 对象是一个封装了数据包函数功能的 EventEmitter。

dgram.Socket 实例是由 `dgram.createSocket()` 创建的。创建 dgram.Socket 实例不需要使用 `new` 关键字。

### 相关事件

- **connect**：因 `connect()` 调用成功而使 socket 与远程地址关联之后触发
- **message**：当有新的数据包被 socket 接收时触发。`msg` 和 `rinfo` 会作为参数传递到该事件的处理函数中
- **listening**：当 socket 开始监听数据包信息时触发该事件处理函数
- **close**：在调用 `close()` 关闭 socket 时触发。该事件一旦触发，则该 socket 不会触发新的 `message` 事件
- **error**：当有任何异常出现时触发该事件处理函数

### socket.bind

```js
socket.bind([port][, address][, callback])

socket.bind(options[, callback])
```

对于 UDP socket，该方法会令 `dgram.Socket` 在指定的 port 和可选的 address 上监听数据包信息。若 `port` 未指定或为 0,操作系统会尝试绑定一个随机的端口。若 `address` 未指定，操作系统会尝试在所有地址上监听。绑定完成式会触发 `listening` 事件，并会调用 `callback` 方法。

一个被绑定的数据包 socket 会令 Node.js 进程保持运行以接收数据包信息。

### socket.send

```js
socket.send(msg[, offset, length][, port][, address][, callback])
```

在 socket 上广播一个数据包。对于无连接的 socket，必须指定目标的 port 和 address。对于连接的 socket，则将会使用其关联的远程端点，因此不能设置 port 和 address 参数。

**msg 参数**

`msg` 参数包含了要发送的消息。根据消息的类型可以有不同的做法。

| 参数类型             | 说明                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Buffer 或 Uint8Array | `offset` 和 `length` 指定了消息在 Buffer 中对应的偏移量和字节数                                                                      |
| String               | 自动按照 utf8 编码转换为 Buffer。对于包含了多字节字符的消息，`offset` 和 `length` 会根据对应的字节长度进行计算，而不是根据字符的位置 |
| Array                | `offset` 和 `length` 必须都不能被指定                                                                                                |

**address 参数**

| 参数类型       | 说明                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| String         | 值为主机名，则 DNS 会被用来解析主机的地址                              |
| 未提供或非真值 | 则 `127.0.0.1`（用于 udp4 socket）或 `::1`（用于 udp6 socket）会被使用 |

可以指定一个可选的 `callback` 方法来汇报 DNS 错误或判断可以安全地重用 `buf` 对象的时机。在 Node.js 事件循环中，DNS 查询会对发送造成至少一个时间点的延迟。

确定数据包被发送的唯一方式就是指定 `callback`。若 `callback` 被指定的情况下有错误发生，该错误会作为 `callback` 的第一个参数。若 `callback` 未被指定，该错误会以 `error` 事件的形式投射到 socket 对象上。

偏移量和长度是可选的，但如果其中一个被指定则另一个也必须被指定。另外，它们只在第一个参数是 Buffer 或 Uint8Array 的情况下才能被使用。

## 应用场景

UDP 速度快，开销低，不用封包/拆包，允许丢一部分数据。适合用于监控统计、日志数据上报、流媒体通信等场景。目前 Node.js 的项目中使用 UDP 比较流行的是 [StatsD](https://github.com/etsy/statsd) 监控服务。

---

**参考资料：**

* [📖 Node Documentation dgram API](http://nodejs.cn/api/dgram.html)
* [📝 Node dgram 模块实现 UDP 通信](https://segmentfault.com/a/1190000011366156)
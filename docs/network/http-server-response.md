---
nav:
  title: 网络
  order: 4
group:
  title: HTTP
  order: 5
title: HTTP ServerResponse
order: 5
---

# HTTP ServerResponse

http.ServerResponse 对象由 HTTP 服务器在内部创建，而不是由用户创建。它作为第二个参数传入 `'request'` 事件。

该对象实现继承自流。

## 监听事件

| 事件   | 描述                                                                                       |
| ------ | ------------------------------------------------------------------------------------------ |
| close  | `response.end()` 被调用前，连接就断开了。此时会触发这个事件。                              |
| finish | 响应头和主体的最后一段已经切换到操作系统以通过网络传输发送，并不意味着客户端已经收到消息。 |

## 状态描述信息

响应请求对象必须包含响应状态码和状态描述信息。通过以下几个方法设置：

| 方法                   | 描述                                   |
| ---------------------- | -------------------------------------- |
| response.statusCode    | 表示刷新响应头发送到客户端的状态码     |
| response.statusMessage | 表示刷新响应头发送到客户端的状态消息   |
| response.writeHead     | 设置响应头（包括状态码和状态描述信息） |

```js
// 设置响应状态码
res.statusCode = 200;

// 设置响应状态描述信息
res.statusMessage = 'ok';
```

两者差不多，差异点在于

- `res.writeHead()` 可以提供额外的功能，比如设置响应头部。
- 当响应头部发送出去后，`res.statusCode` 和 `res.statusMessage` 会被设置成已发送出去的状态代码和状态描述信息。

## 响应头部

使用以下方法可以对响应头部进行修改等操作：

| 方法                                                         | 描述                                           |
| ------------------------------------------------------------ | ---------------------------------------------- |
| `response.writeHead(statusCode[, statusMessage][, headers])` | 设置响应头，包括状态码、状态描述信息和头部字段 |
| `response.setHeader(name, value)`                            | 为隐式响应头设置单个响应头的值                 |
| response.removeHeader                                        | 移除排队等候中的隐式发送的响应头               |
| response.getHeader                                           | 读取已排队但未发送到客户端的响应头             |
| response.getHeaderNames                                      | 读取响应头名称                                 |
| response.getHeaders                                          | 读取已传出的响应头的浅拷贝                     |
| response.hasHeader                                           | 判断是否设置了指定的响应头字段                 |

### response.writeHead

向请求发送响应头。

```js
response.write(statusCode[, statusMessage][, headers])
```

- 此方法只能在响应对象中调用一次，并且必须在调用 `response.end()` 之前调用

- 如果在调用此方法之前调用了 `response.write()` 或 `response.end()`，则将计算隐式或可变的响应头并调用此函数。

- 当使用 `response.setHeader()` 设置响应头时，则与传给 `response.writeHead()` 的任何响应头合并，且 `response.writeHead()` 的优先。

- 如果调用此方法并且尚未调用 `response.setHeader()`，则直接将提供的响应头值写入网络通道而不在内部进行缓存，响应头上的 `response.getHeader()` 将不会产生预期的结果。 如果需要渐进的响应头填充以及将来可能的检索和修改，则改用 `response.setHeader()`。

```js
const body = 'Hello world!';

response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain',
});
```

⚠️ **注意**：添加和移除响应头的顺序可以随意，但一定要在调用 `res.write()` 和 `res.end()` 之前。

### 增删改查

```js
// 增
response.setHeader('Content-Type', 'text/plain');

// 删
response.removeHeader('Content-Type');

// 改
response.setHeader('Content-Type', 'text/plain');
response.setHeader('Content-Type', 'text/html'); // 覆盖

// 查
response.getHeader('content-type');
```

此外，还有不那么常用的：

- **response.headersSent**：表示 header 是否已经发送

* **response.sendDate**：默认为 `true`。但为 `true` 时，会在 response header 里自动设置 Date 首部

## 响应主体

主要用到 `res.write()` 以及 `res.end()` 两个方法。

`res.write()` API 的信息量略大，建议看下官方文档。

### response.write

```js
response.write(chunk [, encoding][, callback])
```

- 如果调用此方法并且尚未调用 `response.writeHead()`，则将切换到隐式响应头模式并刷新隐式响应头。
- 可以多次调用该方法以提供连续的响应主体片段。
- chunk 可以是 String 或 Buffer。如果 chunk 是一个字符串，则第二个参数指定如何将其编码为字节流。

⚠️ **注意**：在 http 模块中，当请求时 HEAD 请求时，则省略响应主体。同样，204 和 304 响应不得包含消息主体。

第一次调用 `response.write()` 时，它会将缓冲的响应头信息和主体的第一个数据块发送给客户端。 第二次调用 `response.write()` 时，Node.js 假定数据将被流式传输，并分别发送新数据。 也就是说，响应被缓冲到主体的第一个数据块。

如果将整个数据成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，则触发 `'drain'` 事件。

### response.end

```js
response.end([data][, encoding][, callback])
```

完成响应请求并返回客户端。

有点像个语法糖，可以看成下面两个调用的组合。至于 callback，当响应传递结束后触发。

```js
response.write(data, encoding);
response.end();
```

## 其他方法

- `response.finished`：是否响应结束
- `response.sendDate`：是否自动设置 Date 头部（默认是 `true`）。（按 HTTP 协议是必须要的，除非是调试用，不然不要设置为 `false`）
- `response.headersSent`：响应头部是否已发送（只读属性）。
- `response.writeContinue()`：发送 HTTP/1.1 100 Continue 消息给客户端，提示说服务端愿意接受客户端的请求，请继续发送请求正文（body)。

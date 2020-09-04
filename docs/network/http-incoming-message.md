---
nav:
  title: 网络
  order: 4
group:
  title: HTTP
  order: 5
title: HTTP IncomingMessage
order: 4
---

# HTTP IncomingMessage

http.IncomingMessage 对象由 [http.Server](http-server.md) 或 [http.ClientRequest](http-client-request.md) 创建，并分别作为第一个参数传给 `'request'` 和 `'response'` 事件。 它可用于访问响应状态、消息头、以及数据。

该类实现了可读流接口。

## 监听事件

http.IncomingMessage 实例对象可绑定两类监听事件：

| 事件    | 描述               |
| ------- | ------------------ |
| aborted | 请求中止时触发     |
| close   | 表明底层连接已关闭（每个响应触发一次） |

## 实现分析

该对象在服务端（`http.Server`）、客户端（`http.ClientRequest`）作用略微有差异。

- 服务端：获取请求方的相关信息，如 request header 等。
- 客户端：获取响应方返回的相关信息，如 statusCode 等。

### 服务端

标准示例：服务端

```js
// 参数 req 即 http.IncomingMessage 实例
var http = require('http');

var server = http.createServer(function(req, res) {
  console.log(req.headers);
  res.end('ok');
});

server.listen(3000);
```

### 客户端

标准示例：客户端

```js
// 参数 res 即 http.IncomingMessage 实例
var http = require('http');

http.get('http://127.0.0.1:3000', function(res) {
  console.log(res.statusCode);
});
```

## 总结

服务端和客户端区分。

- 服务端：`url`
- 客户端：`statusCode`、`statusMessage`

| 类型 | 名称          | 服务端 | 客户端 |
| ---- | ------------- | ------ | ------ |
| 事件 | aborted       | ✓      | ✓      |
| 事件 | close         | ✓      | ✓      |
| 属性 | headers       | ✓      | ✓      |
| 属性 | rawHeaders    | ✓      | ✓      |
| 属性 | statusCode    | ✕      | ✓      |
| 属性 | statusMessage | ✕      | ✓      |
| 属性 | httpVersion   | ✓      | ✓      |
| 属性 | url           | ✓      | ✕      |
| 属性 | socket        | ✓      | ✓      |
| 方法 | .destroy()    | ✓      | ✓      |
| 方法 | .setTimeout() | ✓      | ✓      |

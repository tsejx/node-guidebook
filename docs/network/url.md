---
nav:
  title: 网络
  order: 4
title: URL
order: 6
---

# URL

URL 字符串是结构化的字符串，包含多个含义不同的组成部分。 解析字符串后返回的 URL 对象，每个属性对应字符串的各个组成部分。

Node.js 中的 `url` 模块提供了两套 API 来处理 URL：一个是旧版本遗留的 API，一个是实现了 [WHATWG](http://nodejs.cn/s/fKgW8d) 标准的新 API。

WHATWG 的 `origin` 属性包括 `protocol` 和 `host`，但不包括 `username` 或 `password`。

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

使用 WHATWG 的 API 解析 URL 字符串：

```js
const myURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
```

使用遗留的 API 解析 URL 字符串：

```js
const url = require('url');
const myURL = url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
```

> 注意：根据浏览器的约定，URL 对象的所有属性都是在类的原型上实现为 `getter` 和 `setter`，而不是作为对象本身的数据属性。因此，与遗留的 `urlObjects` 不同，在 URL 对象的任何属性（例如 `delete myURL.protocol`、`delete myURL.pathname` 等）上使用 `delete` 关键字没有任何效果，但仍返回 `true`。


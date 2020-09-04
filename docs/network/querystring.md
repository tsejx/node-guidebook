---
nav:
  title: 网络
  order: 4
title: QueryString 查询字符串
order: 7
---

# QueryString 查询字符串

`querystring` 模块是 Node.js 提供的用于解析和格式化 URL 查询字符串的实用工具，允许用户提取 URL 的查询部分的值和从键值关联的对象构建查询的模块。该模块定义的方法主要基于 URL 的传统定义 `&`、`=` 等来序列化成对象类型。

🌰 **示例：**

```js
const querystring = require('querystring');
```

- querystring.decode
- querystring.encode
- querystring.escape
- querystring.parse
- querystring.stringify
- querystring.unescape

## 方法使用

### parse

[相关详细文档](http://nodejs.cn/api/querystring.html#querystring_querystring_parse_str_sep_eq_options)

`querystring.parse()` 方法返回的对象不是原型继承自 JavaScript Object。 这意味着典型的 Object 方法如 `obj.toString()`、 `obj.hasOwnProperty()` 等都没有定义并且不起作用。

默认情况下，将假定查询字符串中的百分比编码字符使用 UTF-8 编码。 如果使用其他字符编码，则需要指定其他 decodeURIComponent 选项：

```js
// 假设 gbkDecodeURIComponent 函数已存在

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null, {
  decodeURIComponent: gbkDecodeURIComponent,
});
```

### stringify

[相关详细文档](http://nodejs.cn/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options)

`querystring.stringify()` 方法将会序列化传入 `obj` 中的以下类型的值：

- string 字符串
- number 数值
- boolean 布尔值
- string[] 字符串数组
- number[] 数值数组
- boolean[] 布尔值数组

默认情况下，查询字符串中需要百分比编码的字符将编码为 UTF-8。如果需要其他编码，则需要指定其他 `encodeURIComponent` 选项：

```js
// 假设 gbkEncodeURIComponent 函数已存在。

querystring.stringify({ w: '中文', foo: 'bar' }, null, null, {
  encodeURIComponent: gbkEncodeURIComponent,
});
```

### escape

`querystring.escape()` 方法由 `querystring.stringify()` 使用，通常不会直接使用。它的导出主要是为了允许应用代码在必要时通过将 `querystring.escape` 指定给替代函数来提供替换的百分比编码实现。

### unescape

`querystring.unescape` 方法在给定的 `str` 上执行 URL 百分比编码字符的解码。

`querystring.unescape()` 方法由 `querystring.parse()` 使用，通常不会直接使用它。 它的导出主要是为了允许应用程序代码在必要时通过将 querystring.unescape 分配给替代函数来提供替换的解码实现。

默认情况下，`querystring.unescape()` 方法将尝试使用 JavaScript 内置的 `decodeURIComponent()` 方法进行解码。 如果失败，将使用更安全的不会丢失格式错误的 URL 的等价方法。

---

**参考资料：**

- [📝 深入 Node 模块：querystring](https://jsernews.com/news/172)

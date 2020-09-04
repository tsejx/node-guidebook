---
nav:
  title: 系统
  order: 3
group:
  title: 异步 I/O
  order: 2
title: StringDecoder 字符串解码
order: 7
---

# StringDecoder 字符串解码器

Node.js 提供内置模块 `string_decoder` 用于以保留编码的多子节 UTF-8 和 UTF-16 字符的方式将 Buffer 对象解码为字符串。

该内置模块仅有两个方法：

- `stringDecoder.end([buffer])`：以字符串形式返回存储在内部缓冲区中的任何剩余输入。表示不完整的 UTF-8 和 UTF-16 字符的字节将替换为适合字符编码的替换字符
- `stringDecoder.write([buffer])`：返回已解码的字符串，确保在返回的字符串不包含 Buffer、TypedArray 或 DataView 末尾的任何不完整的多子节字符，并将其存储在内部缓冲区中，以便下次调用 `stringDecoder.write()` 或 `stringDecoder.end()`

它的特殊之处在于，当传入的 Buffer 不完整（比如三子节的字符，只传入了两个），内部会维护一个 internal buffer 将不完整的字节缓存，等到使用者再次调用 `stringDecoder.write(buffer)` 传入剩余的字节，来拼成完整的字符。

这样可以有效避免 Buffer 不完整带来的错误，对于很多场景，比如网络请求中的包体解析等，十分有用。

## 使用方法

### decoder.write()

`decoder.write(buffer)` 调用传入了 Buffer 对象 `<Buffer e4 bd a0>`，相应的返回了对应的字符串 `你`：

```js
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');

// Buffer.from('你') => <Buffer e4 bd a0>
const str = decoder.write(Buffer.from([0xe4, 0xbd, 0xa0]));
console.log(str);
// 输出：你
```

### decoder.end()

当 `decoder.end([buffer])` 被调用时，内部剩余的 `buffer` 会被一次性返回。如果此时带上 `buffer` 参数，那么相当于同时调用 `decoder.write(buffer)` 和 `decoder.end()`。

```js
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

// Buffer.from('你好') => <Buffer e4 bd a0 e5 a5 bd>
let str = decoder.write(Buffer.from([0xe4, 0xbd, 0xa0, 0xe5, 0xa5]));
console.log(str);
// 输出：你

str = decoder.end(Buffer.from([0xbd]));
console.log(str);
// 输出：好
```

### 分多次写入多个字节

分多次写入多个字节时，`string_decoder` 模块的处理过程：

首先，传入 `<Buffer e4 bd a0 e5 a5>`，`好` 还差 1 个字节，此时，`decoder.write(xx)` 返回 `你`。

然后，再次调用 `decoder.write(Buffer.from([0xbd]))`，将剩余的 1 个字节传入，成功返回 `好`。

```js
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');

// Buffer.from('你好') => <Buffer e4 bd a0 e5 a5 bd>
let str = decoder.write(Buffer.from([0xe4, 0xbd, 0xa0, 0xe5, 0xa5]));
console.log(str);
// 输出：你

str = decoder.write(Buffer.from([0xbd]));
console.log(str);
// 输出：好
```

### 字节数不完整的处理方法

`decoder.end(buffer)` 时，仅传入 `好` 的第一个字节，此时调用 `decoder.end()`，返回 `�`，对应的 Buffer 为 `<Buffer ef bf bd>`。

```js
const StringDecoder = require('string_decoder').StringDecoder;

// Buffer.from('好') => <Buffer e5 a5 bd>
let decoder = new StringDecoder('utf-8');
let str = decoder.end(Buffer.from([0xe5]));
console.log(str);
// 输出：�
console.log(Buffer.from(str));
// <Buffer ef bf bd>
```

官方文档对于这种情况的解释时，约定俗称地，当 `utf8` 码点无效时，替换成 `ef bf bd`。

> Returns any remaining input stored in the internal buffer as a string. Bytes representing incomplete UTF-8 and UTF-16 characters will be replaced with substitution characters appropriate for the character encoding.

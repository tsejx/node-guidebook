---
nav:
  title: 系统
  order: 3
group:
  title: 异步 I/O
  order: 2
title: Path 路径
order: 11
---

# Path 路径

Node.js 中分为**相对路径**和**绝对路径**两种，相对路径表示当前目录层级对于目标的位置，而绝对路径表示目标当前所在的位置。

## 相对路径

- `./` 表示当前目录，不使用 `require` 时，与 `process.cwd()` 一样，使用 `require` 时，与 `__dirname` 一样
- `../` 表示上层目录

只有在 `require()` 时才使用相对路径的写法，其它地方一律使用绝对路径。

```js
// 当前目录下
path.dirname(__filename) + '/path.js';

// 相邻目录下
path.resolve(__dirname) + '../regexp/regexp.js';
```

## 绝对路径

- `__dirname` 被执行的 JavaScript 文件所在目录的绝对路径
- `__filename` 被执行的 JavaScript 文件的绝对路径
- `process.cwd()` 当前 Node 命令执行时所在的文件夹的绝对路径

## 常用方法

- `path.join([...paths])` 使用平台特定的分隔符把所有 `path` 片段连接到一起，并规范化生成的路径（仅将参数地址进行物理连接）
- `path.resolve([...paths])` 将路径或路径片段的序列处理成绝对路径。指定的路径序列是从右往左开始处理的，后面的 `path` 被依次处理，直到构造完绝对路径（会对参数中的每一个路径尝试执行 `cd` 操作，直到拿到最后一个路径对应的绝对路径）

🌰 **示例：**

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// return: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// throw 'TypeError: Path must be a string. Received {}'

path.resolve('/foo/bar', './baz');
// return: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// return: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

## 文件路径解析流程

- 先生成 cacheKey，判断响应 cache 是否存在，若存在直接返回
- 如果 path 的最后一个字符不是 `/`
  - 如果路径是一个文件并且存在，那么直接返回文件的路径
  - 如果路径是一个目录，调用 `tryPackage` 函数去解析目录下的 `package.json`，然后取出其中的 `main` 字段所写入的文件路径
    - 判断路径如果存在，直接返回
    - 尝试在路径后面加上 `.js`、`.json` 和 `.node` 三种后缀名，判断是否存在，存在则返回
    - 尝试在路径后面依次加上 `index.js`、`index.json` 和 `index.node`，判断是否存在，存在则返回
- 如果还不成功，直接对当前路径加上 `.js`、`.json` 和 `.node` 后缀名进行尝试
- 如果 path 最后一个字符是 `/`
  - 调用 `tryPackage`，解析流程和上面的情况类似
  - 如果不成功，尝试在路径后面依次加上 `index.js`、`index.json` 和 `index.node`，判断是否存在，存在则返回

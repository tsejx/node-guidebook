# 路径

Node.js 中分为**相对路径**和**绝对路径**两种，相对路径表示当前目录层级对于目标的位置，而绝对路径表示目标当前所在的位置。

## 相对路径

* `./` 表示当前目录
* `../` 表示上层目录

## 绝对路径

* `__dirname` 被执行的 JavaScript 文件所在目录的绝对路径
* `filename` 被执行的 JavaScript 文件的绝对路径
* `process.cwd()` 当前 Node 命令执行时所在的文件夹的绝对路径

## 常用方法

* `path.join([...paths])` 使用平台特定的分隔符把所有 `path` 片段连接到一起，并规范化生成的路径
* `path.resolve([...paths])` 将路径或路径片段的序列处理成绝对路径。指定的路径序列是从右往左开始处理的，后面的 `path` 被依次处理，直到构造完绝对路径

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

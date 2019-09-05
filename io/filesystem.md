# 文件系统

文件 I/O 是由简单封装的标准 POSIX 函数提供。通过 `require('fs')` 使用文件模块。所有的方法都有**异步**和**同步**两种形式。

## 文件流

若要处理数据，流（Stream）在 Node.js 中是最好的。

- source：数据来源对象
- pipeline：数据流向的过程
- sink：数据最后存放的地方

> Know more [Stream Handbook](https://github.com/substack/stream-handbook)

## 文件权限

使用 `fs.access` 的目的是为了检查指定文件或者目录的用户权限。

可供权限检查的常量：

- `fs.constants.F_OK`：检查该文件在进程中是否可见
- `fs.constants.R_OK`：检查该文件在进程中是否可读
- `fs.constants.W_OK`：检查该文件在进程中是否可写
- `fs.constants.X_OK`：检查该文件在进程中是否可执行

在使用 `fs.open` 执勤啊，可食用 `fs.access` 去检查文件的可访问性，但 `fs.readFile` 和 `fs.writeFile` 不推荐（使用 `fs.access` 去检查）。

理由很简单，如果你这么做，就会引入了一个竞态条件。在查询权限和操作文件中相互竞争，另外的进程可能已经修改了那个文件。

相反，你应该直接打开这文件并在这处理可能出现的错误。

## 监听文件

使用 `fs.watch`，当（被监听的）文件或者目录有变化时，你会收到通知。

然而，`fs.watch` 这个 API 无法跨平台百分百一致，在某些系统中根本就不可用。

回调函数中的 `fileName` 参数只在 Linux 和 Windows 系统中提供，因此你应该准备好相应的回退机制以防止它是 `undefined`。

## 最佳实践

### 拷贝文件

你可以轻松使用流拷贝文件，尽管文件模块不提供相应的功能。

```js
// Copy A File
const fs = require('fs');

const readableStream = fs.createReadStream('original.txt');
const writableStream = fs.createWriteSteam('copy.txt');

readableStream.pipe(writableStream);
```

使用流去处理文件，最大的好处是在此过程中你可以轻松地加工文件。

### 压缩文件

```js
// Compress A File
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('original.tx.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWritableStream('original.txt'));
```

## 社区生态

社区中维护了一些拓展了文件系统功能的模块方法。

- graceful-fs
- mock-fs
- `lockfile`：文件锁定是在同一时间只允许一个进程去操作文件
- globby：User-friendly glob matching
- cpy：Copy files
- cpy-cli：Copy files on the command-line
- make-dir：Make a direactory and its parents if needed - Think `mkdir -p`
- move-file：Move a file
- del：Delete files and directories
- rimraf
- chokidar
- find-up
- proper-lockfile
- load-json-file
- write-json-file
- fs-write-stream-atomic
- filenamify
- lnfs
- istextorbinary
- fs-jetpack
- fs-extra
- pkg-dir
- filehound
- tempy
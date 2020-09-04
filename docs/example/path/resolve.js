const path = require('path');

// 此方法将路径或路径片段的序列解析为绝对路径
// 给定的路径序列从右到左进行处理，每个后续的 `path` 前置，直到构造除一个绝对路径

// 如果在处理完所有给定的 path 片段之后还未生成绝对路径，则再加上当前工作目录

// 生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠

// 零长度的 `path` 片段会被忽略

// 如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径

// 简便的记忆方法：可以想象现在你在 Shell 命令行下，从左到右运行一遍 `cd path` 命令
// 最终获取的绝对路径/文件名，就是这个接口所返回的结果
// 比如 `path.resolve('/foo/bar', './baz') 可以视为 `cd /foo/bar` => `cd ./baz`

// 假定当前工作目录：/Users/username/Desktop/node-guidebook/example/path

const path1 = path.resolve('');
console.log(path1);
// 输出：/Users/username/Desktop/node-guidebook/example/path

const path2 = path.resolve('.');
console.log(path2);
// 输出：/Users/username/Desktop/node-guidebook/example/path

const path3 = path.resolve('/foo/bar', './baz');
console.log(path3);
// 输出：/foo/bar/baz

const path4 = path.resolve('/foo/bar', './baz/');
console.log(path4);
// 输出：/foo/bar/baz

const path5 = path.resolve('/foo/bar', '/tmp/file');
console.log(path5);
// 输出：/tmp/file

const path6 = path.resolve('../../example', './path');
console.log(path6);
// 输出：/Users/username/Desktop/node-guidebook/example/path

const path7 = path.resolve('../../', 'example', 'path/resolve.js');
console.log(path7);
// 输出：/Users/username/Desktop/node-guidebook/example/path/resolve.js

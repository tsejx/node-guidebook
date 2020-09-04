const path = require('path')

// 返回 `pathName` 的目录名，类似于 Unix 的 dirname 命令。尾部的分隔符将被忽略
const foo = path.dirname('/foo/bar/baz/asdf/index');
console.log(foo);

// 如果 `pathName` 不是字符串，则抛出 TypeError
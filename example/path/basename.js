const path = require('path');

// 返回 path 的最后一部分，类似于 Unix 的 basename 命令
// 尾部的目录分隔符将被忽略

const foo = path.basename('/foo/bar/baz/asdf/index.html');
console.log(foo);
// 输出：index.html

const bar = path.basename('/foo/bar/baz/asdf/index.html', '.html');
console.log(bar);
// 输出：index

// 如果 path 不是字符串或者给定了 ext 且不是字符串，则抛出 TypeError

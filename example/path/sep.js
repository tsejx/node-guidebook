const path = require('path');

// 提供平台特定的路径片段分隔符
// * POSIX：`/`
// * Windows：`\`

// 在 POSIX
const posixSep = 'foo/bar/baz'.split(path.sep);
console.log(posixSep);
// 输出：['foo', 'bar', 'baz']

// 在 Windows
const windowsSep = 'foo\\bar\\baz'.split(path.sep);
console.log(windowsSep);
// 输出： ['foo', 'bar', 'baz']

const path = require('path');

// 使用平台特定的分隔符作为定界符将所有给定的 `path` 片段连接在一起，然后规范化生成路径
// 零长度的 path 片段会被忽略，如果连接的路径字符串是零长度的字符，则返回 `.`，表示当前工作目录
const path1 = path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
console.log(path1);
// 输出：`/foo/bar/baz/asdf`

const path2 = path.join('foo', {}, 'bar');
console.log(path2);
// 抛出 'TypeError: Path must be a string. Received {}'
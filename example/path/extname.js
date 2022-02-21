const path = require('path');

// 返回 `path` 的扩展名
// 从最后一次出现 `.`（句点）字符到 path 最后一部分的字符串结束
// 如果在 path 的最后一部分中没有 `.`（句点），或者如果 path 的基本名称（参阅 path.basename()）除了第一个字符以外没有 `.`（句点），则返回空字符串。

// 最後一个句点字符到结束的字段
const path1 = path.extname('index.html');
console.log(path1);
// 返回: '.html'

// 有多个句点的话，也是截取最后一个句点字符后的字符
const path2 = path.extname('index.coffee.md');
console.log(path2);
// 返回: '.md'

// 如果句点是最后一个字符，那么会返回一个句点
const path3 = path.extname('index.');
console.log(path3);
// 返回: '.'

// 如果 path 最后一部分没有句号，那么返回空字符串
const path4 = path.extname('index');
console.log(path4);
// 返回: ''

// 如果句点是第一个，也返回空字符串
const path5 = path.extname('.index');
console.log(path5);
// 返回: ''

// 返回除第一个为句点以外的最后一个句点的字符串
const path6 = path.extname('.index.md');
console.log(path6);
// 返回: '.md'

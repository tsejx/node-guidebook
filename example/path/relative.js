const path = require('path');

// 根据当前工作目录返回 from 到 to 的相对路径
// 如果 from 和 to 各自解析到相同的路径（分别调用 path.resolve 之后），则返回零长度的字符串

// 如果零长度的字符串传入 from 或 to，则使用当前工作目录代替零长度的字符串

// 在 POSIX 上
const posixPath = path.relative('/foo/bar/baz/aaa', '/foo/bar/baz/bbb');
console.log(posixPath);
// 输出：../bb

// 在 Windows 上
const windowsPath = path.relative('C:\\foo\\bar\\baz\\aaa', 'C:\\foo\\bar\\baz\\bbb');
console.log(windowsPath);
// 輸出：..\\bb

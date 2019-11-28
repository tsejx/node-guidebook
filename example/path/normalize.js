const path = require('path');

// 规范化给定的 path，解析 `..` 和 `.` 片段

// 当找到多个连续的路径段分隔字符时（例如 POSIX 上的 `/`、Windows 上的 `\` 或 `/`），则它们将被替换为单个平台特定的路径段分隔符（POSIX 上的 `/`、Windows 上的 `\`）。 尾部的分隔符会保留

// 如果 path 是零长度的字符串，则返回 `.`，表示当前工作目录

// 总结如下：
// 1. 如果路径为空，返回 `.`（句点），相当于当前的工作路径
// 2. 将对路径中重复的路径分隔符（比如 Linux 下的 `/`）合并为一个
// 3. 对路径中 `.`、`..` 进行处理（类似于 Shell 里的 `cd ..`）
// 4. 如果路径最后有 `/`，那么保留该 `/`

// 路径为空
const path1 = path.normalize('');
console.log('路径为空：', path1);
// 输出：.

// 路径结尾没有带分隔符
const path2 = path.normalize('/foo/bar/baz');
console.log('路径结尾没有带分隔符：', path2);
// 输出：/foo/bar/baz

// 路径结尾有带分隔符
const path3 = path.normalize('/foo/bar/baz/');
console.log('路径结尾有带分隔符：', path3);
// 输出：/foo/bar/baz/

// 重复的分隔符
const path4 = path.normalize('/foo/bar//baz');
console.log('重复的分隔符：', path4);
// 输出：/foo/bar/baz

// 路径带 ..
const path5 = path.normalize('foo/bar/baz/..');
console.log('路径带..：', path5);
// 输出：/foo/bar/baz/

// 相对路径1
const path6 = path.normalize('./foo/bar/baz/');
console.log('相对路径1：', path6);
// 输出：foo/bar/baz/

// 相对路径2
const path7 = path.normalize('foo/bar/baz/');
console.log('相对路径2：', path7);
// 输出：foo/bar/baz/

// 不常用边界1
const path8 = path.normalize('./..');
console.log('不常用边界1：', path8);
// 输出：..

// 不常用边界2
const path9 = path.normalize('..');
console.log('不常用边界2：', path9);
// 输出：..

// 不常用边界3
const path10 = path.normalize('../');
console.log('不常用边界3：', path10);
// 输出：../

// 不常用边界4
const path11 = path.normalize('/../');
console.log('不常用边界4：', path11);
// 输出：/

// 不常用边界5
const path12 = path.normalize('/..');
console.log('不常用边界5：', path12);
// 输出：/

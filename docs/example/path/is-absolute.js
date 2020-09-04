const path = require('path');

// 该方法用于检测 path 是否未绝对路径
// 如果给定的 path 是零长度的字符，则返回 false

// 在 POSIX
const posixPath1 = path.isAbsolute('/foo/bar');
console.log(posixPath1);
// true

const posixPath2 = path.isAbsolute('/baz/..');
console.log(posixPath2);
// true

const posixPath3 = path.isAbsolute('qux/');
console.log(posixPath3);
// false

const posixPath4 = path.isAbsolute('.');
console.log(posixPath4);
// false

// 在 Windows
// const winPath1 = path.isAbsolute('//server');
// console.log(winPath1);
// true

// const winPath2 = path.isAbsolute('\\\\server');
// console.log(winPath2);
// true

// const winPath3 = path.isAbsolute('C:/foo/..');
// console.log(winPath3);
// true

// const winPath4 = path.isAbsolute('C:\\foo\\..');
// console.log(winPath4);
// true

// const winPath5 = path.isAbsolute('bar\\baz');
// console.log(winPath5);
// false

// const winPath6 = path.isAbsolute('bar/baz');
// console.log(winPath6);
// false

// const winPath7 = path.isAbsolute('.');
// console.log(winPath7);
// false

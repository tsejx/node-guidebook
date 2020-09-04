const fs = require('fs');

// FS 常量 以下常量由 fs.constants 输出
// 并非所有操作系统都可以使用每个变量

// 1. 文件可访问性的常量
// 以下常量适用于 fs.access
// 1.1 表明文件对调用进程可见。 这对于判断文件是否存在很有用，但对 rwx 权限没有任何说明。 如果未指定模式，则默认值为该值。
console.log(fs.constants.F_OK);
// 输出：0

// 1.2 表明调用进程可以读取文件。
console.log(fs.constants.R_OK);
// 输出：1

// 1.3 表明调用进程可以写入文件。
console.log(fs.constants.W_OK);
// 输出：2

// 1.4 表明调用进程可以执行文件。 在 Windows 上无效（表现得像 fs.constants.F_OK）。
console.log(fs.constants.X_OK);
// 输出：3

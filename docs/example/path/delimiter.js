const path = require('path');

// 提供平台特定的路径定界符
// `;` 用于 Windows
// `:` 用于 POSIX

console.log(process.env.PATH);
// 输出：'/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'（根据系统设置的环境变量不同而不同）

const segments = process.env.PATH.split(path.delimiter);
console.log(segments);
// 输出：['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']

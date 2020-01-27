/**
 * 获取及设置 URL 的协议部分
 */

const u = new URL('https://example.org');
console.log(u.protocol);
// 输出：https

u.protocol = 'ftp';
console.log(u.href);
// 输出：ftp://example.org/

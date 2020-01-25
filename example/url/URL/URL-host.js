/**
 * 获取及设置 URL 的主机部分
 */

const u = new URL('http://example:80/foo');

console.log(u.host);
// 输出：example:80

u.host = 'example.com:81';
console.log(u.href);
// 输出：http://example.com:81/foo

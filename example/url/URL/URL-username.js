/**
 * 获取及设置 URL 的用户名部分
 */

const u = new URL('https://abc:xyz@example.com');
console.log(u.username);
// 输出：abc

u.username = '123';
console.log(u.href);
// 输出：https://123:xyz@example.com/

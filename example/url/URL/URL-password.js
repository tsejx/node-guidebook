/**
 * 获取及设置 URL 的密码部分
 */

const u = new URL('https://abc:xyz@example.com');

console.log(u.password);
// 输出：xyz

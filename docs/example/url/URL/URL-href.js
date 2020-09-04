/**
 * 获取及设置序列化的 URL
 */

const u = new URL('https://example.org/foo');

console.log(u.href);
// 输出：https://example.org/foo

u.href = 'https://example.com/bar';

console.log(u.href);
// 输出：https://example.com/bar

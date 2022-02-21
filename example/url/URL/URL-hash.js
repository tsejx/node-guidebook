/**
 * 获取及设置 URL 的片段部分
 */

const u = new URL('https://example.org/foo#bar');
console.log(u.hash);
// 输出：#bar

u.hash = 'baz';
console.log(u.href);
// 输出：https://example.org/foo#baz

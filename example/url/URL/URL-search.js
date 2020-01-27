/**
 * 获取及设置 URL 的序列化查询部分
 */

const u = new URL('https://example.org/abc?123');
console.log(u.search);
// 输出：?123

u.search = 'abc=xyz';
console.log(u.href);
// 输出：https://example.org/abc?abc=xyz

/**
 * 获取只读的序列化的 URL 的 origin
 */

const u = new URL('https://example.org/foo/bar?baz');

console.log(u.origin);
// 输出：https://example.org

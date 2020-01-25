/**
 * 获取及设置 URL 的主机名部分。 `url.host` 和 `url.hostname` 之间的区别是 `url.hostname` 不包含端口。
 */

const u = new URL('https://example.org:80/foo');

console.log(u.hostname);
// 输出：example.org

u.hostname = 'example.com:82';

console.log(u.href);
// 输出：https://example.com:80/foo

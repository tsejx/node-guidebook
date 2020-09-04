/**
 * url.format(URL [, options])
 *
 *
 * @param {URL} URL WHATWG URL 对象
 * @param {boolean} auth 如果序列化的 URL 字符串应该包含用户名和密码则为 true，否则为 false。默认值: true。
 * @param {boolean} fragment 如果序列化的 URL 字符串应该包含分段则为 true，否则为 false。默认值: true。
 * @param {boolean} search 如果序列化的 URL 字符串应该包含搜索查询则为 true，否则为 false。默认值: true。
 * @param {boolean} unicode 如果出现在 URL 字符串主机元素里的 Unicode 字符应该被直接编码而不是使用 Punycode 编码则为 true。默认值: false。
 * @return {string}
 */

const url = require('url');

const u = new URL('https://a:b@测试?abc#foo');

console.log(u.href);
// 输出：https://a:b@xn--0zwm56d/?abc#foo

console.log(u.toString());
// 输出：https://a:b@xn--0zwm56d/?abc#foo

console.log(url.format(u, { fragment: false, unicode: true, auth: false }));
// 输出：https://测试/?abc

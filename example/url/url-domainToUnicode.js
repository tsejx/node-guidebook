/**
 * url.domainToUnicode(domain)
 *
 * 返回 Unicode 序列化 domain
 * 如果 domain 是无效域名，则返回空字符串
 *
 * @param {string} domain
 */

const url = require('url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// 输出：español.com

console.log(url.domainToUnicode('xn--fiq228c.com'));
// 输出：中文.com

console.log(url.domainToUnicode('xn--iñvalid.com'));
// 输出：（空）

/**
 * url.domainToASCII(domain)
 *
 * 返回 Punycode ASCII 序列化的 domain
 * 如果 domain 是无效域名，则返回空字符串
 *
 * @param {string} domain
 */

const url = require('url');

console.log(url.domainToASCII('español.com'));
// 输出：xn--espaol-zwa.com

console.log(url.domainToASCII('中文.com'));
// 输出：xn--fiq228c.com

console.log(url.domainToASCII('xn--iñvalid.com'));
// 输出：（空）

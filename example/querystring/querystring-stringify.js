/**
 * querystring.stringify(obj [, sep [, eq [, options]]])
 *
 * querystring.stringify() 方法通过迭代对象的自身属性从给定的 obj 生成 URL 查询字符串。
 *
 * @param {string} obj 要序列化为 URL 查询字符串的对象
 * @param {string} sep 用于在查询字符串中分隔键值对的子字符串。(默认值: '&')
 * @param {string} eq 用于在查询字符串中分隔键和值的子字符串。(默认值: '=')
 * @param {Function} options.encodeURIComponent 在查询字符串中将 URL 不安全字符转换为百分比编码时使用的函数。（默认值: querystring.escape()）
 */

const querystring = require('querystring');

const url = { foo: 'bar', baz: ['qux', 'quux'], corge: 'i' };
const qs = querystring.stringify(url);

console.log(qs);
// 输出：foo=bar&baz=qux&baz=quux&corge=i

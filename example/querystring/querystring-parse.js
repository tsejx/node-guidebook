/**
 * querystring.parse(str [, sep [, eq [, options]]])
 *
 * querystring.parse() 方法将 URL 查询字符串 str 解析为键值对的集合
 *
 * querystring.parse() 方法返回的对象不是原型继承自 JavaScript Object。 这意味着典型的 Object 方法如 obj.toString()、 obj.hasOwnProperty() 等都没有定义并且不起作用。
 *
 * @param {string} str 要解析的 URL 查询字符串
 * @param {string} sep 用于在查询字符串中分隔键值对的子字符串。(默认值: '&')
 * @param {string} eq 用于在查询字符串中分隔键和值的子字符串。(默认值: '=')
 * @param {Function} options.decodeURIComponent 解码查询字符串中的百分比编码字符时使用的函数。（默认值: querystring.unescape()）
 * @param {Function} options.maxKeys 指定要解析的键的最大数量。指定 0 可移除键的计数限制。（默认值: 1000）
 */

const querystring = require('querystring');

const url = 'foo=bar&abc=xyz&abc=123';
const qs = querystring.parse(url);

console.log(qs);
// 输出：{ foo: 'bar', abc: [ 'xyz', '123' ] }
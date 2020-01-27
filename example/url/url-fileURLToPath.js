/**
 * url.fileURLToPath(url)
 *
 * 此方法保证百分号编码字符解码结果的正确性，同时也确保绝对路径字符串在不同平台下的有效性。
 *
 * @param {URL|string} url 要转换为路径的文件 URL 字符串或者 URL 对象
 * @return {string} 完全解析的平台特定的 Node.js 文件路径
 */

const url = require('url');

const u1 = url.fileURLToPath('file:///C:/path/');
console.log(u1);
// 输出：/C:/path/

const u2 = url.fileURLToPath('file:///nas/foo.txt');
console.log(u2);
// 输出：/nas/foo.txt

const u3 = url.fileURLToPath('file:///你好.txt');
console.log(u3);
// 输出：/你好.txt

const u4 = url.fileURLToPath('file:///hello world');
console.log(u4);
// 输出：/hello world

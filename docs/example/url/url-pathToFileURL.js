/**
 * url.pathToFileURL(path)
 *
 * 此函数可确保 path 会被解析为绝对路径，并在转换为文件 URL 时正确编码 URL 控制字符
 *
 * @param {string} path
 */

const url = require('url');

const u1 = url.pathToFileURL('/foo#1');
console.log(u1);
// 输出：file///foo%231（POSIX）


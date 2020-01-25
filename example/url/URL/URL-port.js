/**
 * 获取及设置 URL 的端口部分
 *
 * 端口值可以是数字或包含 0 到 65535（含）范围内的数字字符串。 将值设置为给定 protocol 的 URL 对象的默认端口将会导致 port 值变为空字符串（''）
 *
 * 端口值可以是空字符串，在这种情况下，端口取决于协议/规范：
 * - ftp 21
 * - file
 * - gopher 70
 * - http 80
 * - https 443
 * - ws 80
 * - wss 443
 */

const u = new URL('https://example.org:8888');

console.log(u.port);
// 输出：8888


// 默认端口号将自动转换为空字符串
// HTTPS 协议默认端口是 443
u.port = '443';
console.log(u);
// 打印空字符串
console.log(u.href);
// 输出：https://example.org/
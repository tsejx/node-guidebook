/**
 * 用换行符打印到 stderr，可以传入多个参数，第一个参数用作主要信息，所有其他参数用作类似于 printf(3) 中的替换值（参数都传给 util.format）
 * @param {any} data
 * @param {any} ...args
 */

const code = 5;
console.error('error #%d', code);
// 输出：error #5

console.error('error', code);
// 输出：error 5

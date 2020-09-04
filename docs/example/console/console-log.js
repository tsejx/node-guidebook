/**
 * 打印到 stdout，并加上换行符
 * 可以传入多个参数，第一个参数作为主要信息，其他参数作为类似于 print(3) 中的替代值（参数都会传给 util.format）
 *
 * @param {any} data
 * @param {any} ...args
 */

const count = 5;

console.log('计数：%d', count);
// 输出：计数：5
console.log('计数：', count);
// 输出：计数：5

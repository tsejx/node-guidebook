/**
 * console.countReset([label])
 *
 * 重置指定 label 的内部计数器
 *
 * @param {any} value
 * @param {any} ...message
 */

console.count('abc');
// 输出：abc: 1
console.count('abc');
// 输出：abc: 2

console.countReset('abc');

console.count('abc');
// 输出：abc: 1

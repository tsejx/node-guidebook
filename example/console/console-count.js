/**
 * console.count([label])
 *
 * 维护一个特定于 label 的内部计数器，并将用给定 label 调用 console.count 的次数输出到 stdout
 *
 * @param {any} label
 */

console.count();
// 输出：default: 1

console.count('default');
// 输出：deafult: 2

console.count('abc');
// 输出：abc: 1

console.count('xyz');
// 输出：xyz: 1

console.count('abc');
// 输出：abc: 2

console.count();
// 输出：default: 3

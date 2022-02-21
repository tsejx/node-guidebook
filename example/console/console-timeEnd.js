/**
 * 结束计时器，并将结果打印到 stdout
 *
 * @param {any} table
 */

console.time('Loop');

for (let i = 0; i < 100; i++) {}

console.timeEnd('Loop');
// 输出：Loop: 0.070ms

/**
 * 启动一个计时器，用以计算一个操作的持续时间
 * 计时器由一个唯一的 label 标识
 * 当调用 console.timeEnd 时，可以使用相同的 label 来停止计时器，并以毫秒为单位将持续时间输出到 stdout
 * 计时持续时间精确到亚毫秒
 *
 * @param {any} table
 */

console.time('Loop');

for (let i = 0; i < 100; i++) {}

console.timeEnd('Loop');
// 输出：Loop: 0.070ms

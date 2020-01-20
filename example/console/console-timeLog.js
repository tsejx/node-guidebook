/**
 * 对于先前通过调用 console.time 启动的计时器，将经过时间和其他 data 参数打印到 stdout
 *
 * @param {any} table
 * @param {any} ...data
 */

console.time('Loop');

for (let i = 0; i < 100; i++) {
  if (i === 49) {
    console.timeLog('Loop', i);
    // 输出：Loop: 0.078ms 49
  }
}

console.timeEnd('Loop');
// Loop: 6.797ms

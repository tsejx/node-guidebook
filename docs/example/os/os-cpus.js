const os = require('os');

// 返回一个对象数组，其中包含有关每个逻辑 CPU 内核的信息
const cpus = os.cpus();

console.log(cpus);
// 输出：
// [
//   {
//     model: 'Intel(R) Core(TM) i7-7567U CPU @ 3.50GHz',
//     speed: 3500,
//     times: { user: 2514610, nice: 0, sys: 1636990, idle: 9002080, irq: 0 },
//   },
//   {
//     model: 'Intel(R) Core(TM) i7-7567U CPU @ 3.50GHz',
//     speed: 3500,
//     times: { user: 1591990, nice: 0, sys: 761960, idle: 10799150, irq: 0 },
//   },
//   {
//     model: 'Intel(R) Core(TM) i7-7567U CPU @ 3.50GHz',
//     speed: 3500,
//     times: { user: 2564980, nice: 0, sys: 1286710, idle: 9301400, irq: 0 },
//   },
//   {
//     model: 'Intel(R) Core(TM) i7-7567U CPU @ 3.50GHz',
//     speed: 3500,
//     times: { user: 1496770, nice: 0, sys: 666860, idle: 10989460, irq: 0 },
//   },
// ];

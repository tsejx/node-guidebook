/**
 * 打印字符串 'Trace: ' 到 stderr，然后将 util.format() 格式化的消息和堆栈跟踪打印到代码中的当前位置
 *
 * @param {any} message
 * @param {any} ...args
 */

console.trace('展示');

// 打印：（堆栈跟踪将根据调用跟踪的位置而有所不同）
// at Object.<anonymous> (/Users/mrsingsing/Desktop/mrsingsing/node-guidebook/example/console/console-trace.js:6:9)
// at Module._compile (internal/modules/cjs/loader.js:936:30)
// at Object.Module._extensions..js (internal/modules/cjs/loader.js:947:10)
// at Module.load (internal/modules/cjs/loader.js:790:32)
// at Function.Module._load (internal/modules/cjs/loader.js:703:12)
// at Function.Module.runMain (internal/modules/cjs/loader.js:999:10)
// at internal/main/run_main_module.js:17:11

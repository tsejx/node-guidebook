// process.mainModule 属性提供了一种获取 require.main 的替代方式。 区别在于，若主模块在运行时中发生改变，require.main 可能仍然指向变化之前所依赖的模块。 一般来说，假定两者指向相同的模块是安全的。

// 就像 require.main 一样，如果没有入口脚本， process.mainModule 的值是 undefined。
const fs = require('fs');

console.log(process.mainModule);
// 输出（示例）：
// Module {
//   id: '.',
//   exports: {},
//   parent: null,
//   filename:
//     '/Users/mrsingsing/Desktop/mrsingsing/node-guidebook/example/process/process-main-module.js',
//   loaded: false,
//   children: [],
//   paths: [
//     '/Users/mrsingsing/Desktop/mrsingsing/node-guidebook/example/process/node_modules',
//     '/Users/mrsingsing/Desktop/mrsingsing/node-guidebook/example/node_modules',
//     '/Users/mrsingsing/Desktop/mrsingsing/node-guidebook/node_modules',
//     '/Users/mrsingsing/Desktop/mrsingsing/node_modules',
//     '/Users/mrsingsing/Desktop/node_modules',
//     '/Users/mrsingsing/node_modules',
//     '/Users/node_modules',
//     '/node_modules',
//   ],
// };

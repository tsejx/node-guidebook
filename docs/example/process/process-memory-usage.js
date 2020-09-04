// 获取内存使用情况

// process.memoryUsage() 方法返回 Node.js 进程的内存使用情况的对象，该对象每个属性值的单位为字节

const memoryUsage = process.memoryUsage();

console.log(memoryUsage);
// 输出（示例）：
// {
//   rss: 20791296,      -> 驻留集大小，是给这个进程分配了多少物理内存（占总分配内存的一部分），这些物理内存中包含堆、代码段、以及栈
//   heapTotal: 6610944, -> V8 内存情况
//   heapUsed: 4524080,  -> V8 内存情况
//   external: 8672      -> 代表 V8 管理的，绑定到 JavaScript 的 C++ 对象的内存使用情况
// }

// 对象、字符串、闭包等存于堆内存
// 变量存于栈内存
// 实际的 JavaScript 源代码存于代码段内存

// 使用 Worker 线程时， rss 将会是一个对整个进程有效的值，而其他字段只指向当前线程

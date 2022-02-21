// process.throwDeprecation 的初始值表明是否在当前的 Node.js 进程上设置了--throw -deprecation 标志

// process.throwDeprecation 是可变的，因此可以在运行时设置废弃警告是否应该导致错误

// 有关更多信息，参见 'warning' 事件和 emitWarning() 方法 的文档。

const res = process.throwDeprecation;

console.log(res);
// 运行命令：node --throw-deprecation process-throw-deprecation.js
// 输出（示例）：true

// 不添加 --throw-deprecation 参数时
// 输出（示例）：undefined

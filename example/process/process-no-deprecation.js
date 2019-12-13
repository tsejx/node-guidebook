// process.noDeprecation 属性表明是否在当前 Node.js 进程上设置了 --no-deprecation 标志

// 有关此标志行为的更多信息，请参阅 'warning' 事件和 emitWarning() 方法的文档。
// 开启该标志将会使得自定义的废弃警告作为异常信息抛出来

// 执行：$ node --no-deprecation process-no-deprecation.js
const noDeprecation = process.noDeprecation;

console.log(noDeprecation);
// 输出：true

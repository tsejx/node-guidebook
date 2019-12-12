// process.emitWarning(warning [, options]) 方法用于触发自定义或应用特定的进程警告
// 可以通过给 'warning' 事件增加处理程序来监听这些警告

// options <Object>:
// * type <string> 警告类型的名称
// * code <string> 触发警告实例的唯一标识符
// * ctor <Function> 当 warning 是一个 String 时，则 ctor 是一个可选的函数，用于限制生成的堆栈信息
// * detai <string> 错误的附加信息

// 使用代码和其他详细信息触发警告
process.emitWarning('出错啦', {
  code: 'MY_WARNING',
  detail: '一些额外的信息',
});

// （示例）触发：
// (node: 26383) [MY_WARNING] Warning: 出错啦
// 一些额外的信息

// 避免重复告警
function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    process.emitWarning('只告警一次');
  }
}
emitMyWarning();
// 触发（示例）：(node: 56339) Warning: 只警告一次
emitMyWarning();
// 什么都没触发

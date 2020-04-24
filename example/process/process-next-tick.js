// process.nextTick() 方法将 callback 添加到下一个时间点的队列

// 在 JavaScript 堆栈上的当前操作运行完成之后以及允许事件循环继续之前，此队列会被完全耗尽

// 如果要递归地调用，则可以创建无限的循环

console.log('开始');

process.nextTick(() => {
  console.log('下一个时间点的回调');
});

console.log('调度');

// 输出：
// 开始
// 调度
// 下一个时间点的回调

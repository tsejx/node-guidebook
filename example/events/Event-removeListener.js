const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

const callbackA = () => {
  console.log('调用回调函数A');
  emitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('调用回调函数B');
};

emitter.on('event', callbackA);

emitter.on('event', callbackB);

// 回调函数 A 移除了监听器回调函数 B，但它依然会被调用
// 触发时内部的监听器数组为 [callbackA, callbackB]
emitter.emit('event');
// 输出：
// => 调用回调函数A
// => 调用回调函数B

// callbackB 现已被移除
// 内部的监听器数组为 [callback]
emitter.emit('event');
// 输出：
// => 调用回调函数 A

// 最多只会从监听器数组中移除一个监听器
// 如果监听器被多次添加到指定 `eventName` 的监听器数组中，则必须多次调用 `removeListener` 才能移除所有实例
// 一旦事件被触发，所有绑定到该事件的监听器都会按顺序依次调用
// 这意味着，在事件触发之后、且最后一个监听器执行完成之前，`removeListener` 或 `removeAllListener` 不会从 `emit` 中移除它们

// 因为监听器是使用内部数组进行管理的，所以调用它将更改在删除监听器后注册的任何监听器的位置索引
// 这不会影响调用监听的顺序，但这意味着需要重新创建由 `emitter.listeners` 方法返回的监听器数组的任何副本

// 如果单个函数作为处理程序多次添加为单个事件
// 则 `removeListener` 将删除最近添加的实例

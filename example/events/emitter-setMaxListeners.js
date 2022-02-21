const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

// 默认情况下，为特定事件添加超过 10 个监听器，则 EventEmitter 会打印一个警告，这有利于发现内存泄漏
// 但是，并不是所有的事件都要限制 10 个监听器
// 下面的方法可以为指定的 EventEmitter 实例修改监听器最大值限制
// 设为 Infinity 或 0 表示不限制监听器的数量
emitter.setMaxListeners(20);

const maxListeners = emitter.getMaxListeners();

console.log(maxListeners);
// 20

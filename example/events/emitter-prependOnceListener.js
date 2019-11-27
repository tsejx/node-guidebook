const EventEmitter = require('events');
// 定义一个类继承 EventEmitter
class Emitter extends EventEmitter {}

// 实例化一个 Emitter 对象
const emitter = new Emitter();

const eventName = Symbol('event');

emitter.on(eventName, () => console.log('第二次调用'));

// 添加单次监听器到名为 `eventName` 的事件的监听器数组的开头
// 当 `eventName` 事件下次触发时，监听器会先被移除，然后再调用
emitter.prependOnceListener(eventName, () => console.log('第一次调用'));

emitter.emit(eventName);
// 输出：
// ==> 第一次调用
// ==> 第二次调用

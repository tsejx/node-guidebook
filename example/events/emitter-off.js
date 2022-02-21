const EventEmitter = require('events');
// 定义一个类继承 EventEmitter
class Emitter extends EventEmitter {}

// 实例化一个 Emitter 对象
const emitter = new Emitter();

const eventName = Symbol('event');

const callback = arg => {
  console.log(`${arg} An evnet occured with 'on' methods!`);
};

// 给 emitter 对象绑定 `event` 事件
emitter.on(eventName, callback);

// 触发 emitter 的 `event` 事件
emitter.emit(eventName, 'Hello!');

console.log('移除监听前', emitter.eventNames());

// 与 emitter.removeListener 效果相同
// 移除名为 eventName 事件的监听器数组中指定的 listener
emitter.off(eventName, callback);

console.log('移除监听器后：', emitter.eventNames());

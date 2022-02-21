const EventEmitter = require('events');
// 定义一个类继承 EventEmitter
class Emitter extends EventEmitter {}

// 实例化一个 Emitter 对象
const emitter = new Emitter();

const eventName = Symbol('event');

// 给 emitter 对象绑定 `event` 事件
emitter.addListener(eventName, arg => {
  console.log(`${arg} An evnet occured with 'addListener' method!`);
});

// 触发 emitter 的 `event` 事件
emitter.emit(eventName, 'Hello!');
// 输出：'Hello! An event occured with "addListener" method!'

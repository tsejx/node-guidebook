const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const eventName = Symbol('event');

const emitter = new Emitter();

emitter.on(eventName, () => console.log('foo'));

emitter.on(eventName, () => console.log('bar'));

// 获取事件名为 `eventName` 的监听事件的数量
const count = emitter.listenerCount(eventName);

// 输出：2
console.log(count);

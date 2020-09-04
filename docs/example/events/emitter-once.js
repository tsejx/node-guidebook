const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

// 添加单次监听器
// `eventName` 事件下次触发时，监听器会被移除，然后再调用
emitter.once('event', () => {
  console.log('调用 `event` 事件');
});

// 执行 `eventName` 事件
emitter.emit('event');

console.log(emitter.eventNames());
// 输出：[]

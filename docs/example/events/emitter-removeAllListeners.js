const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

emitter.on('eventA', () => console.log('A'));

emitter.on('eventB', () => console.log('B'));

emitter.on('eventC', () => console.log('C'));

console.log(emitter.eventNames());
// 输出：['eventA', 'eventB', 'eventC']

// 移除全部监听器或指定的 `eventName` 事件的监听器
// 删除代码中其它位置添加的监听器是不好的做法，尤其是当 `EventEmitter` 实例是由某些其它组件或模块（例如套接字或文件流）创建时
emitter.removeAllListeners();

console.log(emitter.eventNames());
// 输出：[]

// ============================================================

emitter.on('eventD', () => console.log('D'));

emitter.on('eventE', () => console.log('E'));

console.log(emitter.eventNames());
// 输出：['eventD', 'eventE']

// 推荐这种去除方式
// 指定移除的事件名称，而不是所有都删除
emitter.removeAllListeners('eventE');

console.log(emitter.eventNames());
// 输出：['eventD']

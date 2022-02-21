const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

// 获取当前 EventEmitter 实例监听器最大限制数的值
const maxListeners = emitter.getMaxListeners();

// 默认为 EventEmitter.defaultMaxListeners 的值，也就是 10
// 可以通 emitter.setMaxListeners(n) 设置
console.log(maxListeners);
// 10

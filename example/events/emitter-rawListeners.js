const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.once('log', () => console.log('只记录一次'));

// 返回一个数组，包含了一个封装了 `listener` 方法的监听器（例如 `.once()` 创建的）
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// 打印 `只记录一次`，但不会解绑 `once` 事件
logFnWrapper.listener();
// 输出：只记录一次

// 打印 `只记录一次`，且移除监听器
logFnWrapper();
// 输出：只记录一次

emitter.on('log', () => console.log('持续地记录'));

// 返回一个数组，只包含 `.on()` 绑定的监听器
const newListeners = emitter.rawListeners('log');

// 打印两次 “持续学习”
newListeners[0]();
emitter.emit('log');

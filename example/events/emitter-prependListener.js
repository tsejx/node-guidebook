const EventEmitter = require('events');
// 定义一个类继承 EventEmitter
class Emitter extends EventEmitter {}

// 实例化一个 Emitter 对象
const emitter = new Emitter();

const eventName = Symbol('event');

// 给 emitter 对象绑定 `Symbol('event')` 事件
emitter.on(eventName, () => console.log('EventListenerA'));

// 添加 `listener` 函数到名为 `eventName` 的事件的监听器数组的开头
// 不会检查 `listener` 是否已被添加
// 多次调用并传入相同的 `eventName` 和 `listener` 会导致 `listener` 被添加多次
emitter.prependListener(eventName, () => console.log('EventListenerB'));

// 触发 emitter 的 `Symbol('event')` 事件
emitter.emit(eventName);
// 输出：
// ==> 'EventListenerB'
// ==> 'EventListener'

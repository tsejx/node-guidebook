const EventEmitter = require('events');
// 定义一个类继承 EventEmitter
class Emitter extends EventEmitter {}

// 实例化一个 Emitter 对象
const emitter = new Emitter();

const foo = 'foo';
const bar = Symbol('bar');

// 给 emitter 对象绑定 `foo` 事件
emitter.addListener(foo, () => {
  console.log('An evnet occured');
});

// 给 emitter 对象绑定 `bar` 事件
emitter.addListener(bar, () => {
  console.log('An evnet occured');
});

// 获取已注册监听器的事件名数组，数组中的值为字符串或 Symbol
const eventNames = emitter.eventNames();

console.log(eventNames);
// ['foo', Symbol(bar)]

const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

// 当新增监听器时，会触发 `newListener` 事件
// 当移除已存在的监听器时，则触发 `removeListener` 事件

// 在添加监听器之前触发事件的事实具有微妙但重要的副作用：在 `newListener` 回调中注册到相同 `name` 的任何其它监听器将插入到正在添加的监听器之前。

// 只处理一次，避免无限循环
emitter.once('newListener', (eventName, listener) => {
  // 执行 `eventName` 为 `event` 事件时，执行回调函数
  if (eventName === 'event') {
    // 在前面插入一个新的监听器
    emitter.on('event', () => {
      console.log('执行新 listener 的回调函数');
    });
  }
});

emitter.on('event', () => {
  console.log('执行 event 事件的回调函数');
});

emitter.emit('event');
// 输出：
// => 执行新 listener 的回调函数
// => 执行 event 事件的回调函数

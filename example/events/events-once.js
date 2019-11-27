// once 方法新增于 Node v.11.13.0+
const { once, EventEmitter } = require('events');

async function run() {
  const emitter = new EventEmitter();

  process.nextTick(() => {
    emitter.emit('event', '触发事件');
  });

  // 创建一个 Promise，当 EventEmitter 触发给定的事件时则会被解决
  // 当 EventEmitter 触发 `error` 时则会被拒绝
  // 解决 Promise 时将会带上触发到给定事件的所有参数的数据
  // 此方法时有意通用的，并且可与 Web 平台的 EventTarget 接口一起使用，该接口没有特殊的 `error` 事件语义且不监听 `error` 事件
  const [value] = await once(emitter, 'event');
  console.log(value);

  const err = new Error('错误信息');
  process.nextTick(() => {
    emitter.emit('error', err);
  });

  try {
    await once(emitter, 'event');
  } catch (err) {
    console.log('出错了', err);
  }
}

run();
// 输出：
// ==> 触发事件
// ==> 出错了 Error: 错误信息

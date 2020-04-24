// `queueMicrotask()` 方法将微任务排队以调用回调函数
// 如果回调函数跑出异常，则将会触发 `process` 对象的 `uncaughtException` 事件
// 微任务由 V8 管理，可以与 `process.nextTick()` 队列（由 Node.js 管理）类似的方法使用。
// 始终在 Node.js 事件循环的每个回合中的微任务队列之前处理 `process.nextTick()` 队列

// `queueMicrotask()` 用于确保 `load` 事件始终异步地触发，且因此保持一致
// 在这里使用 `process.nextTick()` 会导致 `load` 事件总是在任何其他 Promise 任务之前触发

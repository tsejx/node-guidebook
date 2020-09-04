---
nav:
  title: 引擎
  order: 2
group:
  title: 事件机制
  order: 1
title: Events 事件
order: 1
---

# Events 事件

## 同步和异步

## 仅处理事件一次

## 错误事件

## EventEmitter

### 监听事件

- `newListener`：EventEmitter 实例在新的监听器被添加到其内部监听器数组之前，会触发自身的 `newListener` 事件。
- `removeListener`：`listener` 被移除后触发。

### 静态方法/属性

### 实例方法/属性

- `emitter.addListener(eventName, listener)`：`emiiter.on` 的别名
- `emiiter.emit(eventName [, ...args])`：按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
- `emiiter.eventNames()`：返回已注册监听器的事件名数组。数组中的值为字符串或 `Symbol`。
- `emitter.getMaxListeners()`：返回 EventEmitter 当前的监听器最大限制数的值，可使用 `emitter.setMaxListeners(n)` 设置或默认为 `EventEmitter.defaultMaxListeners`。
- `emitter.listenerCount(eventName)`：返回正在监听的名为 `eventName` 的事件的监听器的数量。
- `emitter.listeners(eventName)`：返回名为 `eventName` 的事件的监听器数组的副本。
- `emitter.off(eventName, listener)`：`emitter.removeListener()` 的别名
- `emitter.on(eventName, listener)`：添加 `listener` 函数到名为 `eventName` 事件的监听器数组的末尾。不会检查 `listener` 是否已被添加。多次调用并传入相同的 `eventName` 与 `listener` 会导致 `listener` 会被添加多次。
- `emitter.once(eventName, listener)`：添加单次监听器 `listener` 到名为 `eventName` 的事件。当 `eventName` 事件下次触发时，监听器会先被移除，然后再调用。
- `emitter.prependListener(eventName, listener)`：添加 `listener` 函数到名为 `eventName` 的事件的监听器数组的开头。不会检查 `listener` 是否已被添加。多次调用并传入相同的 `eventName` 和 `listener` 会导致 `listener` 被添加多次。
- `emitter.prependOnceListener(eventName, listener)`：添加单次监听器 `listener` 到名为 `eventName` 的事件的监听器数组的开头。 当 `eventName` 事件下次触发时，监听器会先被移除，然后再调用。
- `emitter.removeAllListeners([eventName])`：移除全部监听器或指定的 `eventName` 事件的监听器。删除代码中其它位置添加的监听器是不好的做法，尤其是当 `EventEmitter` 实例是由某些其它组件或模块（例如套接字或文件流）创建时。
- `emitter.removeListener(eventName, listener)`：从名为 `eventName` 的事件的监听器数组中移除指定的 `listener`。
- `emitter.setMaxListeners(n)`：默认情况下，如果为特定事件添加了超过 10 个监听器，则 `EventEmitter` 会打印一个警告，这有助于发现内存泄露。但是，并不是所有的事件都要限制 10 个监听器。`emitter.setMaxListeners()` 方法可以为指定的 `EventEmitter` 实例修改限制。值设为 `Infinity`（或 `0`）表示不限制监听器的数量。
- `emitter.rawListeners(eventName)`：返回 `eventName` 事件的监听器的拷贝，包括封装的监听器（例如由 `.once()` 创建的）。
- `events.once(emitter.name)`：创建一个 Promise，当 EventEmitter 触发给定的事件时则会被解决，当 EventEmitter 触发 `'error'` 时则会被拒绝。解决 Promise 时将会带上触发到给定事件的虽有参数的数组。

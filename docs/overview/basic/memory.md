---
nav:
  title: 概览
  order: 1
group:
  title: 架构
  order: 1
title: 内存控制
order: 4
---

# 内存控制

```bash
# 设置老生代内存空间的最大值
node --max-old-space-size=1700 test.js

# 设置新生代内存空间的最大值
node --max-new-space-size=1024 test.js
```

V8 的内存没有办法根据使用情况自动扩充，当内存分配过程中超过极限值时，就会引起进程出错。

变量的主动释放

如果变量是全局变量（通过 `var` 声明或定义在 `global` 变量上），由于全局作用域需要直到进程退出才能释放，此时将导致引用的对象常驻内存（常驻在老生代中）。如果需要释放常驻内存的对象，可以通过 `delete` 操作来删除引用关系。或者将变量重新赋值，让旧对象脱离引用关系。在接下来的老生代内存清除和整理的过程中，会被回收释放。

🌰 **标准示例：**

```js
global.foo = 'I am global object';
console.log(global.foo); // => 'I am global object'

delete global.foo;
// 或重新赋值
global.foo = undefined; // 或 null

console.log(global.foo); // => undefined
```

同样，如果在非全局作用域中，想主动释放变量引用的对象，也可以通过这样的方式。虽然 `delete` 操作和重新赋值具有相同的效果，但是在 V8 中通过 `delete` 删除对象的属性有可能干扰 V8 的优化，所以通过赋值方式解除引用更好。

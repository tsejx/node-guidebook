---
nav:
  title: 工具应用
  order: 6
group:
  title: 测试
  path: /test
  order: 5
title: Jest - 通用
order: 9
---

# 通用

简单测试结构

```js
function sum(a, b) {
  return a + b;
}

it('Add 1 to 2 equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

异步的测试结构

```js
async function sum(a, b) {
  return a + b;
}

it('adds 1 + 2 to equal 3', async () => {
  const total = await sum(1, 2);
  expect(total).toBe(3);
});
```

Mock Function 结构

1. `jest.fn` 用于穿件一个 Mock Function
2. mockCallback.mock 可以访问 Mock Function 的状态

```js
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);
```

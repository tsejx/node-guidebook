---
nav:
  title: 工具应用
  order: 6
group:
  title: 测试
  path: /test
  order: 5
title: Enzyme
order: 30
---

# Enzyme

- Shallow Rendering：将组件渲染成虚拟 DOM 对象，但是只渲染第一层，不渲染所有子组件，所以处理速度非常快，并且它不需要 DOM 环境

## 生命周期

React 生命周期：

1. componentWillMount
2. componentDidMount
3. componentWillReceiveProps
4. shouldComponentUpdate
5. componentWillUpdate
6. componentDidUpdate
7. componentWillUnmount

通过断言即可测试

```js
expect(wrapper.state().xxx);
```

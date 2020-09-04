---
nav:
  title: 服务端应用
  order: 5
group:
  title: Koa
  path: /server-framework/koa
  order: 11
title: Koa
order: 1
---

# Koa

Koa 是一个基于 Node 实现的一个新的 Web 框架，它是由 Express 框架的原班人马打造的。它的特点是优雅、简洁、表达力强、自由度高。它更 Express 相比，它是一个更轻量的 node 框架，因为它所有功能都通过插件实现，这种插拔式的架构设计模式，很符合 Unix 哲学。

Koa 框架现在更新到了 2.x 版本，本文从零开始，循序渐进，讲解 Koa2 的框架源码结构和实现原理，展示和详解 Koa2 框架源码中的几个最重要的概念，然后手把手教大家亲自实现一个简易的 Koa2 框架，帮助大家学习和更深层次的理解 Koa2，看完本文以后，再去对照 Koa2 的源码进行查看，相信你的思路将会非常的顺畅。

本文所用的框架是 Koa2，它跟 Koa1 不同，Koa1 使用的是 generator+co.js 的执行方式，而 Koa2 中使用了 `async/await`，因此本文的代码和 demo 需要运行在 Node 8 版本及其以上，如果读者的 Node 版本较低，建议升级或者安装 `babel-cli`，用其中的 `babel-node` 来运行本文涉及到的代码。

洋葱模型

## 不足

> Koa 框架有哪些不足的地方？

**框架能力：**

- 没有进程管理，你得搭配着 Docker 或者 PM2 在生产环境里跑。进程间通信也没有；
- 没有提供数据库的 ORM 或者即插即用的数据库驱动，需要第三方包；
- WebSocket 就不提了

**工程化：**

- 没有架构范式，你得自己拆分 Controller、Model、Provider、Module 之类的组件（合理地解耦并且组织组件，其实是很有难度的事情，因为架构直接决定了代码的稳定性和可测试性）；
- 不提供任何测试能力，意味着你需要自己选择合适的测试框架，并且自己写单测、集成测试、E2E；
- 没有日志能力，所以你要自己设计 logger，设计合理的日志格式；
- 静态类型就更没有了（当然 TS 的 types 文件还是有的），想上 TS 或者其它方案得自己弄，而这对于比较大的服务端开发来说是刚需。

搭配生态中的第三方包，也能构建出大型的工程，但是在这个过程中，对开发人员自身的代码架构设计能力就有很高的要求了，不然就全是面条状的代码，给测试和维护带来很高的成本。

**参考资料：**

- [大家觉得 Koa 框架还有什么不足的地方吗？](https://www.zhihu.com/question/320893133)

# Koa 生态

## 中间件

路由
静态文件
测试
日志
进程管理

## 脚手架

## 教程

- [chenshenhai/koa2-note 《Koa2 进阶学习笔记》](https://github.com/chenshenhai/koa2-note)

## 项目

https://www.cnblogs.com/tugenhua0707/category/1372178.html

学习 Koa 源码的整体架构，浅析 Koa 洋葱模型原理和 CO 原理
https://juejin.im/post/5e69925cf265da571e262fe6

Koa2 进阶学习笔记
https://chenshenhai.github.io/koa2-note/

## 取 IP

```js
class IP {
  get ips() {
    const proxy = this.app.proxy;
    const val = this.get(this.app.proxyIpHeader);

    let ips = proxy && val ? val.split(/\s*,\s*/) : [];

    if (this.app.maxIpsCount > 0) {
      ips = ips.slice(-this.app.maxIpsCount);
    }

    return ips;
  }

  get ip() {
    if (!this[IP]) {
      this[IP] = this.ips[0] || this.socket.remoteAddress || '';
    }

    return this[IP];
  }
}
```

[Koa 官网](https://koa.bootcss.com/)

[Koa Router](https://www.npmjs.com/package/koa-router)

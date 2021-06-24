---
nav:
  title: 服务端应用
  order: 5
group:
  title: Koa
  path: /server-framework/koa
  order: 11
title: koa-router
order: 3
---

# koa-router

## API Rreference

- koa-router
  - Router
    - new Router([opts])
    - instance
      - `.get|put|post|patch|delete|del` => `Router`
      - `.routes` => `function`
      - `.use([path], middleware)` => `Router`
      - `.prefix(prefix)` => `Router`
      - `.allowedMethods([options])` => `function`
      - `.redirect(source, destination, [code])` => `Router`
      - `.route(name)` => `Layer | false`
      - `.url(name, params, [options])` => `String | Error`
      - `.param(param, middleware)` => `Router`
    - static
      - `.url(path, params)` => `String`

## router.allowedMethods

router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以

- 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
- 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头

* 响应 options 方法，告诉它所支持的方法
* 相应地返回 405（）和 401（）

高级路由功能

前缀

多中间件

HTTP options 方法的作用是什么？

- 检测服务器所支持的请求方法
- CORS 中的预检请求

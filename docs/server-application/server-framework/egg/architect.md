---
nav:
  title: 服务端应用
  order: 5
group:
  title: Egg
  path: /server-framework/egg
  order: 12
title: 框架架构
order: 2
---

# 框架架构

## 目录结构

```
egg-project
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
|   ├── router.js 配置 URL 路由规则
│   ├── controller 解析用户的输入，处理后返回相应的结果
│   |   └── home.js
│   ├── service (可选) 编写业务逻辑层
│   |   └── user.js
│   ├── middleware (可选) 编写中间件
│   |   └── response_time.js
│   ├── schedule (可选) 定时任务
│   |   └── my_task.js
│   ├── public (可选) 放置静态资源
│   |   └── reset.css
│   ├── view (可选) 模版文件
│   |   └── home.tpl
│   └── extend (可选) 框架扩展
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js 配置需要加载的插件
|   ├── config.default.js 配置文件
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

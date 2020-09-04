---
nav:
  title: 服务端应用
  order: 5
group:
  title: 服务端架构设计
  order: 1
title: 日志设计
order: 5
---

# 日志设计

egg 框架日志系统由 egg-logger 模块支持。

主要特性：

- 日志分级
- 统一错误日志，所有 logger 中使用 `.error()` 打印的 `ERROR` 级别日志都会打印到统一的错误日志文件中，便于追踪
- 启动日志和运行日志分离
- 自定义日志
- 多进程日志
- 自动切割日志
- 高性能

线上应用日志配置

尽量使用 logback.xml

输出规则：

```
<pattern>[%date{ISO8601}] [%level] %logger{80} %thread [%X{TRACE_ID}] 组名 应用名 - %msg%n</pattern>
```

存放路径：

应用日志不得存放在根目录及其他级目录下，必须制定如下路径

```
/data/log-center/project/server.log
```

归档设置：

最大历史时间固定为 30 天，运维每天凌晨将上一天日志保存至海量存储，并保留 90 天（本地磁盘无历史对的日志）

```
/data/log-center/project/server.%d{yyyy-MM-dd}.log
```

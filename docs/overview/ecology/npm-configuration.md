---
nav:
  title: 概览
  order: 1
group:
  title: 生态
  order: 3
title: npm 配置文件
order: 3
---

# 配置文件

- npmrc
- .npmignore
- .npm

## npmrc


```bash
# 查看 .npmrc 文件在哪里
npm config ls -l
```

npm 的缓存目录在哪里

```bash
npm config get cache
```

npm 的全局 node 包在哪里

那些通过 `npm install xxx -g` 或者 `cnpm install xxx -g` 或者 `yarn global add xxx` 安装的 `xxx` 文件，到底安装在什么地方？

```bash
npm config get prefix
```

默认情况下：

- Windows 系统的路径基础部分是： `%APPDATA%/npm/`
- MacOS 系统下路径基础部分是 `/usr/local`

默认的全局安装包位置：

- Windows 系统下路径是：`%APPDATA%/npm/node_modules/`
- MacOS 系统下路径是：`/usr/local/lib/node_modules/`

当然对于全局包路径的查看，还可以使用下面的命令：`npm root -g`
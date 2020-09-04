---
nav:
  title: 概览
  order: 1
group:
  title: 生态
  order: 3
title: npm 脚本命令
order: 2
---

# npm cli 命令

- `access`：在发布的包上设置访问级别
- `adduser`：Add a registry user account 添加仓库用户账户
- `audit`：Run a security audit 执行安全审计（自动安装应该更新的脆弱的模块包）
- `bin`：显示 npm bin 文件夹
- `bugs`：在浏览器中打开依赖包的 BUG 讨论社区
- `build`：构建依赖包
- `cache`：管理模块的缓存
- `ci`：Install a project with a clean slate
- `completion`：Tab Completion for npm
- `config`：管理 npm 配置文件
- `dedupe`：Reduce duplication
- `deprecate`：Deprecate a version of a package
- `dist-tag`：修改依赖包分发标签
- `docs`：在浏览器中打开依赖包的文档
- `doctor`：Check your environments
- `edit`：Edit an installed package
- `explore`：Browse an installed package
- `help-search`：Search npm help documentation
- `help`：查看某条命令的详细帮助
- `hook`：Manage registry hooks
- `init`：创建 npm 依赖包配置文件
- `install-ci-test`：Install a project with a clean slate and run tests
- `install-test`：Install package(s) and run tests
- `install`：安装依赖包
- `link`：符号连接包文件夹
- `logout`：Log out of the registry
- [`ls`](https://docs.npmjs.com/cli-commands/ls.html)：列出已安装依赖包
- `npm`：javascript package manager
- `org`：Manage orgs
- `outdated`：检查过期的依赖包
- `owner`：Manage package owners
- `pack`：Create a tarball from a package
- `ping`：Ping npm registry
- `prefix`：显示路径前缀
- `profile`：变更注册表配置文件上的设置
- `prune`：删除无关的软件包
- `publish`：发布依赖包
- `rebuild`：重新构建依赖包
- `repo`：在浏览器中打开依赖包的储存仓库
- `restart`：Restart a package
- `root`：查看包的安装路径
- `run-script`：运行 npm script 脚本
- `search`：搜索依赖包
- `shrinkwrap`：Lock down dependency versions for publication
- `star`：收藏依赖包
- `stars`：查看依赖包收藏夹
- `start`：启动依赖包
- `stop`：停止依赖包
- `team`：Manage organization teams and team memberships
- `test`：测试依赖包
- `token`：管理鉴权令牌
- `uninstall`：移除依赖包
- `unpublish`：从公有仓库中移除依赖包
- `update`：U 更新模块
- `version`：查看模块版本
- `view`：查看模块的注册信息
- `whoami`：显示当前 npm 用户信息

## 创建项目

```bash
# 按提示输入项目信息
npm init

# 使用默认值创建项目
npm init -y
```

## 安装模块

```bash
npm install
# or
npm i
```

## 安装多个模块

无需为你要安装的每个模块都输入一遍 `npm i` 指令：

```bash
npm i gulp-pug
npm i gulp-debug
npm i gulp-sass
```

只需输入一行命令即可一次性批量安装模块

```bash
npm i gulp-pug gulp-debug gulp-sass
```

更便捷的是，如果安装的所有模块的前缀是相同的，则可以这样安装，无需输入完整模块名

```bash
npm i gulp{-debug,-sass,-pug}
```

## 安装标识

安装包到生产环境依赖中：

```bash
npm i gulp --save-prod
```

更简化，你可以使用 `-P` 标识：

```bash
npm i gulp -P
```

同理，开发环境下的依赖安装，亦可使用 `-D` 代替 `--save-dev`：

```bash
npm i gulp -D
```

当不带任何安装标识时，npm 默认将模块作为依赖项目添加到 `package.json` 文件中。如果你想避免这样，你可以使用 `no-save` 安装：

```bash
npm i vue --no-save
```

## 查看安装包信息

```bash
# 查看包信息
npm view <package-name>

npm view react

# 或者
npm v react

# 如果只想看安装包最近的版本信息
npm v <package-name> version

# 如果想获取安装包完整的版本信息列表，可使用复数形式
npm v <package-name> versions

```

## 安装指定版本

如果你想安装一个不是最新版本的安装包：

```bash
npm i react@16.11.0
```

鉴于记住标签比记住版本数字容易，亦可使用 `npm v` 命令来查到的版本信息列表中的 `dist-tag` 来安装：

```bash
npm i react@beta
```

## 搜索安装包

```bash
# 搜索依赖包
npm search <package-name>

npm search react

# 或者
npm s <package-name>

npm se <package-name>

npm find <package-name>

#
```

## 卸载模块

如果你不想转到 `package.json` 文件并手动删除依赖包，则可以用以下方法删除：

```bash
npm uninstall vue
```

这个命令会删除 `node_modules` 文件夹及 `package.json` 中对应的包。当然，你也可以用 `rm`、`un` 或 `r` 来达到相同的效果：

```bash
npm rm vue
```

如果由于某些原因，你只想从 `node_modules` 文件夹中删除安装包，但是想在 `package.json` 中保留其依赖项，那么你可以使用 `no-save` 标识。

```bash
npm rm vue --no-save
```

## 依赖枚举

`npm ls`此命令将以树状结构将已安装的软件包的所有版本及其依赖项打印到标准输出。

如果想看项目中使用了哪些模块：

```bash
npm ls
```

## 过期依赖枚举

大多数时候，你需要保持本地依赖的更新，你可以在项目目录下先查看一下安装包有没有版本更新：

```bash
npm outdate
```

## 执行测试

```bash
npm run tests

npm test

npm t
```

## 显示可用脚本

我们可以通过

```bash
npm run
```

## 安装 Github 包

可以直接安装来自 Github Repo 的模块：

```bash
npm i https://github.com/sindresorhus/gulp-debug
```

或者你可以忽略域名安装：

```bash
npm i sindresorhus/gulp-debug
```

## 打开模块包仓库主页

当然可以直接谷歌搜索，然后找到对应的包链接打开：

```bash
npm repo create-react-app
```

## 列出所有 NPM 环境的可用变量

你可以使用这个命令来列出所有 NPM 环境的可用变量：

```bash
npm run env | grep npm_
```

默认情况下，npm 会重命名你的变量，给其加上前缀 `npm_package`，并将其结构保留在 `package.json` 文件中，即变为 `config_build_folder`。

## 在 npm 脚本中使用 npm 变量

你可以看到可用变量的完整列表，如果你想使用这些变量中的任何值，就可以在 `package.json` 中使用：

```bash
"scripts": {
    "build": "gulp build --dist $npm_package_config_build_folder"
}
```

当你执行 `npm run build` 的时候，实际执行的是这样的：

```bash
gulp build --dist ./dist
```

## 检查过期的依赖包

```bash
# 查看过期依赖包
npm outdated

# 以 JSON 形式输出
npm outdated --json
```

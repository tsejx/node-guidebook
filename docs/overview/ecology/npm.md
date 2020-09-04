---
nav:
  title: 概览
  order: 1
group:
  title: 生态
  order: 3
title: npm
order: 1
---

# NPM

npm 即 npde package module

CommonJS 的包规范的定义由包结构和包描述文件两个部分组成，前者用于组织包中的各种文件，后者则用于描述包的相关信息，以供外部读取分析。

## 包结构

包实际上是一个存档文件，即一个目录直接打包为 `.zip` 或 `.tar.gz` 格式的文件，安装后解压还原为目录。完全符合 CommonJS 规范的包目录应该包含如下这些文件。

- `package.json`：包描述文件
- `bin`：用于存放二进制文件的目录
- `lib`：用于存放 JavaScript 代码的目录
- `doc`：用于存放文档的目录
- `test`：用于存放单元测试用例的代码

## 包描述文件

包描述文件用于表达非代码相关的信息，它是一个 JSON 格式的文件，位于包的根目录下。NPM 的所有行为都与包描述文件的字段息息相关。

CommonJS 的包规范：

- `name`：包名。由小写的字母和数字组成，可以包含 `.`、`_` 被 `-`，但不允许出现空格。
- `descript`：包简介。
- `version`：版本号。语义化的版本号，详细定义参看 [http://semver.org](http://semver.org)
- `keywords`：关键词数组，用于分类搜索。
- `maintainers`：包维护者列表。每个维护者由 name、email 和 web 这三个属性组成。
- `contributors`：贡献者列表。
- `bugs`：用于反馈 BUG 的网页地址或邮件地址
- `licenses`：许可证列表。
- `repositories`：托管源代码的位置列表，表明可以通过哪些方式和地址访问包的源代码
- `dependencies`：包所需要的依赖的包列表
- `devDependencies`：开发时所需要的依赖列表。
- `peerDependencies`：

**其他可选字段**

- `homepage`：当前包的网站地址
- `os`：操作系统支持列表。
- `cpu`：CPU 架构的支持列表
- `engine`：支持的 JavaScript 引擎列表
- `builtin`：标识当前包是否是内建在底层系统的标准组件
- `directories`：包目录说明
- `implements`：实现规范的列表
- `scripts`：脚本说明对象。主要被包管理器用于安装、编译、测试和卸载包。

NPM 包规范额外的字段：

- `author`：包作者
- `bin`：一些包作者希望包可以作为命令行工具使用。配置好 bin 字段后，通过 `npm install package_name -g` 命令可以将脚本添加到执行路径中，之后可以在命令行中直接执行
- `main`：模块引入方法 `require()` 在引入包的时，会优先检查这个字段，并将其作为保重其余模块的入口

## 潜在问题

临时使用

```bash
npm --registry https://registry.npm.taobao.org install express
```

持久使用

```bash
npm config set registry https://registry.npm.taobao.org
```

## 构建配置包设计

构建配置抽离成 npm 包意义

- 通用型
  - 业务开发者无需关注构建配置
  - 统一团队构建脚本
- 可维护性
  - 构建配置合理的拆分
  - README 文档、ChangeLog 文档等
- 质量
  - 冒烟测试、单元测试、测试覆盖率
  - 持续集成

### 构建配置管理的可选方案

通过多个配置文件管理不同环境的构建，`webpack --config` 参数进行控制

将构建配置设计成一个库，比如：`hij-webpack`、`Neutrino`、`webpack-blocks`

抽成一个工具进行管理，比如 `create-react-app`、`kyt`、`nwb`

将所有的配置放在一个文件，通过 `--env` 参数控制分支选择

### 设计方案

通过多个配置文件管理不同环境的 Webpack 配置

- 基础配置：webpack.base.js
- 开发环境：webpack.dev.js
- 生产环境：webpack.prod.js
- SSR 环境：webpack.ssr.js

抽离成一个 npm 包统一管理：

- 规范：Git Commit 日志、README、ESlint 规范、Semver 规范
- 质量：冒烟测试、单元测试、测试覆盖率和 CI

### webpack-merge 组合配置

```js
const merge = require('webpack-merge')

merge(
    { a: [1], b: 5, c: 20 },
    { a: [2], b: 10, d: 421 }
);

{ a: [1, 2], b: 10, c: 20, d: 421 }

// 合并配置
module.exports = merge(baseConfig, devConfig);
```

## 功能模块设计和目录结构

## 使用 ESLint 规范构建脚本

## 冒烟测试

冒烟测试是指对提交测试的软件在进行详细深入的测试之前而进行的预测试，这种预测试的主要目的是暴露导致软件需重新发布的基本功能失效等严重问题。

## 单元测试测试覆盖率

## 持续集成和 Travis CI

持续集成的作用

优点：

- 快速发现错误
- 防止分支大幅度偏离主干

核心措施是，代码集成到主干之前，必须通过自动化测试。只要有一个测试用例失败，就不能集成。

## 发布构建包到 npm 社区

添加用户：npm adduser

升级版本：

- 升级补丁版本：npm version patch
- 升级小版本号：npm version minor
- 升级大版本号：npm version major

发布版本：npm publish

## Git Commit 规范和 ChangeLo 生成

cz-cli（The commitizen command line utility）
每次 git cz 代替 git commit，会自动运行交互程序，填空，就能创建规范的 commit log 信息
https://github.com/commitizen/cz-cli

commitlint

husky -> `commit-msg` -> `pre-commit`

```bash
npm install husky
```

通过 commit-msg 钩子校验信息：

```json
{
  "scripts": {
    "commit-msg": "validate-commit-msg",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  },
  "devDependencies": {
    "validate-commit-msg": "^2.11.1",
    "conventional-changelog-cli": "^1.2.0",
    "husky": "^0.13.1"
  }
}
```

## 语义化版本（SemanticVersioning）规范格式

开源项目版本信息案例

软件的版本通常由三位组成，形如：

X.Y.Z

版本是严格递增的，此处是：

16.2.0 -> 16.3.0 -> 16.3.1

在发布重要版本时，可以发布 alpha、rc 等先行版本

- alpha 内部灰度
- beta 外部小范围
- rc 公测

### 遵守 semver 规范的优势

优势：

- 避免出现循环依赖
- 依赖冲突减少

### 语义化版本（Semantic Versioning）规范格式

主版本号：当你做了不兼容的 API 修改

次版本号：当你做了向下兼容的功能性新增

修订号：当你做了向下兼容的问题修正

### 先行版本号

先行版本号可以作为发布正式版之前的版本，格式是在修订版本号后面加上一个连接号（`-`），再加上一连串以点（`.`）分割的标识符，标识符可以由英文、数字和连接号（`[0-9A-Za-z]`）组成

- alpha：内部测试版，一般不向外部发布，会有很多 BUG，一般只有测试人员使用。
- beta：也是测试版本，这个阶段的版本会一直加入新的功能，在 Alpha 版之后推出
- rc：Release Candidate 系统平台上就是发行候选版本。RC 版不会再加入新的功能了，主要着重于除错。

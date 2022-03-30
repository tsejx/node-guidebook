---
nav:
  title: 概览
  order: 1
group:
  title: 生态
  order: 3
title: npm 包描述文件
order: 1
---

# NPM 包描述文件

`npm` 即 npde package module

CommonJS 的包规范的定义由 **包结构** 和 **包描述文件** 两个部分组成，前者用于组织包中的各种文件，后者则用于描述包的相关信息，以供外部读取分析。

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

## 必备属性

### name

`name` 字段定义了模块的名称，其命名时需要遵循官方的一些规范和建议：

- 模块名会成为模块 URL、命令行中的一个参数或者一个文件夹名称，任何非 URL 安全的字符在模块名中都不能使用（我们可以使用 [validate-npm-package-name](https://www.npmjs.com/package/validate-npm-package-name) 包来检测模块名是否合法）；
- 语义化模块名，可以帮助开发者更快的找到需要的模块，并且避免意外获取错误的模块；
- 若模块名称中存在一些符号，将符号去除后不得与现有的模块名重复，例如：由于 `react-router-dom` 已经存在，`react.router.dom`、`reactrouterdom` 都不可以再创建。

`name` 字段不能与其他模块名重复，我们可以执行以下命令查看模块名是否已经被使用：

```bash
npm view <package-name>
```

- 如果模块存在，可以查看该模块的基本信息
- 如果该模块名称未被使用过，则会抛出 404 错误

### version

`npm` 包中的模块版本都需要遵循 SemVer 规范，相关介绍可查阅 [npm 版本控制](./npm-version)

## 描述信息

### description & keywords

`description` 字段用于添加模块的描述信息，便于用户了解该模块。

`keywords` 字段用于给模块添加关键字。

当我们使用 npm 检索模块时，会对模块中的 `description` 字段和 `keywords` 字段进行匹配，写好 `package.json` 中的 `description` 和 `keywords` 将有利于增加我们模块的曝光率。

### author

`author` 字段用于描述主要作者。

### contributors

`contributors` 字段用于描述贡献者。

### homepage

`homepage` 字段用于描述项目的主页。

### repository

`repository` 字段用于描述模块的代码仓库。

### bugs

`repository` 字段用于描述提交 BUG 的地址。

## 依赖配置

### dependencies

`dependencies` 字段指定了项目生产环境运行所依赖的模块（生产环境使用），如 `antd`、`react`、`moment` 等依赖库：

- 它们是我们生产环境所需要的依赖项，在把项目作为一个 `npm` 包的时候，用户安装 `npm` 包时只会安装 `dependencies` 里面的依赖。

### devDepenedencies

`devDependencies` 字段指定了项目开发所需要的模块（开发环境使用），如 `webpack`、`typescript`、`babel` 等：

- 在代码打包提交线上时，我们并不需要这些依赖包，所以我们将它放入 `devDependencies` 中。

### peerDepenencies

`peerDependencies` 字段的目的是提示宿主环境去安装满足插件 `peerDependencies` 所指定依赖的包，然后在插件 `import` 或者 `require` 所依赖的包的时候，永远都是引用宿主环境统一安装的 `npm` 包，最终解决插件与所依赖包不一致的问题。

举个例子，就拿目前基于 React 的 UI 组件库 `ant-design@4.x` 来说，因该 UI 组件库只是提供一套 React 组件库，它要求宿主环境需要安装指定的 React 版本。具体可以看它 `package.json` 中的配置：

```json
{
  "peerDependencies": {
    "react": ">=16.9.0",
    "react-dom": ">=16.9.0"
  }
}
```

它要求宿主环境安装 `react@>=16.9.0` 和 `react-dom@>=16.9.0` 的版本，而在每个 `antd` 组件的定义文件顶部：

```ts
import * as React from 'react';
import * as ReactDOM from 'react-dom';
```

组件中引入的 `react` 和 `react-dom` 包其实都是宿主环境提供的依赖包。

有了 `package.json` 文件，开发直接使用 `npm install` / `yarn install` 命令，就会在当前目录中自动安装所需要的模块，安装完成项目所需的运行和开发环境就配置好了。

### optionalDependencies

不阻断安装依赖

### bundledDependencies

打包依赖

## 目录文件

### main

`main` 字段是 `package.json` 中的另一种元数据功能，它可以用来指定加载的入口文件。假如你的项目是一个 `npm` 包，当用户安装你的包后，`require('my-module')` 返回的是 `main` 字段中所列出文件的 `module.exports` 属性。

当不指定 `main` 字段时，默认值是模块根目录下面的 `index.js` 文件。

### bin

用过 `vue-cli` 或 `create-react-app` 等脚手架的朋友们，不知道你们有没有好奇过，为什么安装这些脚手架后，就可以使用类似 `vue create`/`create-react-app` 之类的命令，其实这和 `package.json` 中的 `bin` 字段有关。

`bin` 字段用来指定各个内部命令对应的可执行文件的位置。当 `package.json` 提供了 `bin` 字段后，即相当于做了一个命令名和本地文件名的映射。

当用户安装带有 `bin` 字段的包时，

- 如果是全局安装，`npm` 将会使用符号链接把这些文件链接到 `/usr/local/node_modules/.bin/`
- 如果是本地安装，会链接到 `./node_modules/.bin/`

举个例子，如果要使用 `my-app-cli` 作为命令时，可以配置以下 `bin` 字段：

```json
{
  "bin": {
    "my-app-cli": "./bin/cli.js"
  }
}
```

上面代码指定，`my-app-cli` 命令对应的可执行文件为 `bin` 子目录下的 `cli.js`，因此在安装了 `my-app-cli` 包的项目中，就可以很方便地利用 `npm` 执行脚本：

```json
{
  "scripts": {
    "start": "node node_modules/.bin/my-app-cli"
  }
}
```

咦，怎么看起来和 `vue create`/c`reate-react-app` 之类的命令不太像？原因：

- 当需要 `node` 环境时就需要加上 `node` 前缀
- 如果加上 `node` 前缀，就需要指定 `my-app-cli` 的路径 -> `node_modules/.bin`，否则 `node my-app-cli` 会去查找当前路径下的 `my-app-cli.js`，这样肯定是不对。

若要实现像 `vue create`/`create-react-app` 之类的命令一样简便的方式，则可以在上文提到的 `bin` 子目录下可执行文件 `cli.js` 中的第一行写入以下命令：

```js
#!/usr/bin/env node

```

这行命令的作用是告诉系统用 `node` 解析，这样命令就可以简写成 `my-app-cli` 了。

### files

`files` 字段用于描述我们使用 `npm publish` 命令后推送到 `npm` 服务器的文件列表，如果指定文件夹，则文件夹内的所有内容都会包含进来。

我们可以查看下载的 `antd` 的 `package.json` 的 `files` 字段，内容如下：

```json
{
  "files": ["dist", "lib", "es"]
}
```

另外，我们还可以通过配置一个 `.npmignore` 文件来排除一些文件， 防止大量的垃圾文件推送到 npm 上。

### man

### directories

## 脚本配置

### script

`scripts` 字段是 `package.json` 中的一种元数据功能，它接受一个对象，对象的属性为可以通过 `npm run` 运行的脚本，值为实际运行的命令（通常是终端命令），如：

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

将终端命令放入 `scripts` 字段，既可以记录它们又可以实现轻松重用。

### config

## 发布配置

### private

<!-- 定义私有模块 -->

一般公司的非开源项目，都会设置 `private` 属性的值为 `true`，这是因为 `npm` 拒绝发布私有模块，通过设置该字段可以防止私有模块被无意间发布出去。

### preferGlobal

### publishConfig

### os

<!-- 指定模块适用系统 -->

假如我们开发了一个模块，只能跑在 `darwin` 系统下，我们需要保证 `windows` 用户不会安装到该模块，从而避免发生不必要的错误。

这时候，使用 `os` 属性则可以帮助我们实现以上的需求，该属性可以指定模块适用系统的系统，或者指定不能安装的系统黑名单（当在系统黑名单中的系统中安装模块则会报错）：

```json
{
  // 适用系统
  "os": ["darwin", "linux"],
  // 黑名单
  "os": ["!win32"]
}
```

> Tips：在 node 环境下可以使用 `process.platform` 来判断操作系统。

### cpu

<!-- 指定模块适用 CPU 架构 -->

和上面的 `os` 字段类似，我们可以用 `cpu` 字段更精准的限制用户安装环境：

```json
{
  // 适用 CPU
  "cpu": ["x64", "ia32"],
  // 黑名单
  "cpu": ["!arm", "!mips"]
}
```

> Tips：在 node 环境下可以使用 `process.arch` 来判断 cpu 架构。

### engines

<!-- 指定项目 Node 版本 -->

有时候，新拉一个项目的时候，由于和其他开发使用的 `node` 版本不同，导致会出现很多奇奇怪怪的问题（如某些依赖安装报错、依赖安装完项目跑步起来等）。

为了实现项目开箱即用的伟大理想，这时候可以使用 `package.json` 的 `engines` 字段来指定项目 `node` 版本：

```json
{
  "engines": {
    "node": ">=8.16.0"
  }
}
```

该字段也可以指定适用的 `npm` 版本：

```json
{
  "engines": {
    "npm": ">= 6.9.0"
  }
}
```

需要注意的是，`engines` 属性仅起到一个说明的作用，当用户版本不符合指定值时也不影响依赖的安装。

## 协议

MIT
Apache
GPL

## 自定义字段

一些第三方 npm 包，会在 package.json 中定义字段。

例如 husky 等 pre-commit

## 参考资料

- [重新认识 package.json](https://juejin.cn/post/6844904159226003463)
- [一文搞懂 peerDependencies](https://segmentfault.com/a/1190000022435060)

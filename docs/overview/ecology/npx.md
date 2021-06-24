---
nav:
  title: 概览
  order: 1
group:
  title: 生态
  order: 3
title: npx
order: 4
---

# NPX

Node 自带 npm 模块，所以可以直接使用 npx 命令。

```bash
$ npm install -g npx
```

npx 的特性：

- 避免安装全局模块
- 调用项目内部安装的模块

## 调用项目安装的模块

npx 想要解决的主要问题，就是调用项目内部安装的模块。比如，项目内部安装了测试工具 Mocha。

```bash
$ npm install -D mocha
```

一般来说，调用 Mocha，只能在项目脚本和 package.json 的 scripts 字段里面，如果想再命令行下调用，必须像下面这样。

```bash
# 项目的根目录下执行
$ node-modules/.bin/mocha --version
```

npx 就是想解决这个问题，让项目内部安装的模块用起来更方便，只要像下面这样调用就行了。

```bash
$ npx mocha --version
```

npx 的原理很简单，就是运行的时候，会到 `node_modules/.bin` 路径和环境变量 `$PATH` 里面，检查命令是否存在。

由于 npx 会检查环境变量 `$PATH`，所以系统命令也可以调用。

```bash
# 等同于 ls
$ npx ls
```

注意，Bash 内置的命令不在 `$PATH` 里面，所以不能用。比如，`cd` 是 Bash 命令，因此就不能用 `npx cd`。

## 避免全局安装模块

除了调用项目内部模块，npx 还能避免全局安装的模块。比如，`create-react-app` 这个模块是全局安装，npx 可以运行它，而且不进行全局安装。

```bash
$ npx create-react-app my-react-app
```

上面代码运行时，npx 将 `create-react-app` 下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载 `create-react-app`。

下载全局模块时，npx 允许指定版本。

```bash
$ npx uglify-js@3.1.0 main.js -o ./dist/main.js
```

上面代码指定使用 3.1.0 版本的 `uglify-js` 压缩脚本。

注意，只要 npx 后面的模块无法在本地发现，就会**下载同名模块**。比如，本地没有安装 `http-server` 模块，下面的命令会自动下载该模块，在当前目录启动一个 Web 服务。

```bash
$ npx http-server
```

## 本地模块运行参数

**`--no-install` 参数**

如果想让 npx **强制使用**本地模块，不下载远程模块，可以使用 `--no-install` 参数。如果本地不存在该模块，就会报错。

```bash
$ npx --no-install http-server
```

**`--ignore-existing` 参数**

反过来，如果**忽略**本地的同名模块，强制安装使用远程模块，可以使用 `--ignore-existing` 参数。比如，本地已经全局安装了 `create-react-app`，但还是想使用远程模块，就用这个参数。

```bash
$ npx --ignore-existing create-react-app my-react-app
```

## 使用不同版本的 Node

利用 npx 可以下载模块这个特点，可以指定某个版本的 Node 运行脚本。它的窍门就是使用 npm 的 node 模块。

```bash
$ npx node@0.12.8 -v
v0.12.8
```

上面命令会使用 0.12.8 版本的 Node 执行脚本。原理是从 npm 下载这个版本的 node，使用后再删掉。

某些场景下，这个方法用来切换 Node 版本，要比 nvm 那样的版本管理器方便一些。

## -p 参数

`-p` 参数用于指定 npx 所要安装的模块，所以上一节的命令可以写成下面这样。

```bash
$ npx -p node@0.12.8 node -v
v0.12.8
```

上面命令先指定安装 `node@0.12.8`，然后再执行 `node -v` 命令。

`-p` 参数对于需要安装多个模块的场景很有用。

```bash
$ npx -p lolcatjs -p cowsay [command]
```

## -c 参数

如果 npx 安装多个模块，默认情况下，所执行的命令之中，只有第一个可执行项会使用 npx 安装的模块，后面的可执行项还是会交给 Shell 解释。

```bash
$ npx -p lolcatjs -p cowsay 'cowsay hello | lolcatjs'
# 报错
```

上面代码中，`cowsay hello | lolcatjs` 执行时会报错，原因是第一项 `cowsay` 由 npx 解释，而第二项命令 `localcatjs` 由 Shell 解释，但是 `lolcatjs` 并没有全局安装，所以报错。

`-c` 参数可以将所有命令都用 npx 解释。有了它，下面代码就可以正常执行了。

```bash
$ npx -p lolcatjs -p cowsay -c 'cowsay hello | lolcatjs'
```

`-c` 参数的另一个作用，是将环境变量带入所要执行的命令。举例来说，npm 提供当前项目的一些环境变量，可以用下面的命令查看。

```bash
$ npm run env | grep npm_
```

`-c` 参数可以把这些 npm 的环境变量带入 npx 命令。

```bash
$ npx -c 'echo "$npm_package_name"'
```

上面代码会输出当前项目的项目名。

## 直接运行远端脚本

npx 还可以执行 GitHub 上面的模块源码。

```bash
# 执行 Gist 代码
$ npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32

# 执行仓库代码
$ npx github:piuccio/cowsay hello
```

注意，远程代码必须是一个模块，即必须包含 `package.json` 和入口脚本。

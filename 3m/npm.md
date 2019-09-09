# NPM

npm 即 npde package module

CommonJS 的包规范的定义由包结构和包描述文件两个部分组成，前者用于组织包中的各种文件，后者则用于描述包的相关信息，以供外部读取分析。

## 包结构

包实际上是一个存档文件，即一个目录直接打包为 `.zip` 或 `.tar.gz` 格式的文件，安装后解压还原为目录。完全符合 CommonJS 规范的包目录应该包含如下这些文件。

* `package.json`：包描述文件
* `bin`：用于存放二进制文件的目录
* `lib`：用于存放 JavaScript 代码的目录
* `doc`：用于存放文档的目录
* `test`：用于存放单元测试用例的代码

## 包描述文件

包描述文件用于表达非代码相关的信息，它是一个 JSON 格式的文件，位于包的根目录下。NPM 的所有行为都与包描述文件的字段息息相关。

CommonJS 的包规范：

* `name`：包名。由小写的字母和数字组成，可以包含 `.`、`_` 被 `-`，但不允许出现空格。
* `descript`：包简介。
* `version`：版本号。语义化的版本号，详细定义参看 [http://semver.org](http://semver.org)
* `keywords`：关键词数组，用于分类搜索。
* `maintainers`：包维护者列表。每个维护者由 name、email 和 web 这三个属性组成。
* `contributors`：贡献者列表。
* `bugs`：用于反馈 BUG 的网页地址或邮件地址
* `licenses`：许可证列表。
* `repositories`：托管源代码的位置列表，表明可以通过哪些方式和地址访问包的源代码
* `dependencies`：包所需要的依赖的包列表

**其他可选字段**

* `homepage`：当前包的网站地址
* `os`：操作系统支持列表。
* `cpu`：CPU 架构的支持列表
* `engine`：支持的 JavaScript 引擎列表
* `builtin`：标识当前包是否是内建在底层系统的标准组件
* `directories`：包目录说明
* `implements`：实现规范的列表
* `scripts`：脚本说明对象。主要被包管理器用于安装、编译、测试和卸载包。

NPM 包规范额外的字段：

* `author`：包作者
* `bin`：一些包作者希望包可以作为命令行工具使用。配置好 bin 字段后，通过 `npm install package_name -g` 命令可以将脚本添加到执行路径中，之后可以在命令行中直接执行
* `main`：模块引入方法 `require()` 在引入包的时，会优先检查这个字段，并将其作为保重其余模块的入口
* `devDependencies`：开发时所需要的依赖列表。


## 潜在问题

临时使用

```bash
npm --registry https://registry.npm.taobao.org install express
```

持久使用

```bash
npm config set registry https://registry.npm.taobao.org
```


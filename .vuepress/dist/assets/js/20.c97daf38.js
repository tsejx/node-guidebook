(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{293:function(a,s,e){"use strict";e.r(s);var t=e(0),n=Object(t.a)({},(function(){var a=this,s=a.$createElement,e=a._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"npx"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#npx"}},[a._v("#")]),a._v(" NPX")]),a._v(" "),e("p",[a._v("Node 自带 npm 模块，所以可以直接使用 npx 命令。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("npm")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v(" -g npx\n")])])]),e("h2",{attrs:{id:"调用项目安装的模块"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#调用项目安装的模块"}},[a._v("#")]),a._v(" 调用项目安装的模块")]),a._v(" "),e("p",[a._v("npx 想要解决的主要问题，就是调用项目内部安装的模块。比如，项目内部安装了测试工具 Mocha。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("npm")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v(" -D mocha\n")])])]),e("p",[a._v("一般来说，调用 Mocha，只能在项目脚本和 package.json 的 scripts 字段里面，如果想再命令行下调用，必须像下面这样。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 项目的根目录下执行")]),a._v("\n$ node-modules/.bin/mocha --version\n")])])]),e("p",[a._v("npx 就是想解决这个问题，让项目内部安装的模块用起来更方便，只要像下面这样调用就行了。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx mocha --version\n")])])]),e("p",[a._v("npx 的原理很简单，就是运行的时候，会到 "),e("code",[a._v("node_modules/.bin")]),a._v(" 路径和环境变量 "),e("code",[a._v("$PATH")]),a._v(" 里面，检查命令是否存在。")]),a._v(" "),e("p",[a._v("由于 npx 会检查环境变量 "),e("code",[a._v("$PATH")]),a._v("，所以系统命令也可以调用。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 等同于 ls")]),a._v("\n$ npx "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("ls")]),a._v("\n")])])]),e("p",[a._v("注意，Bash 内置的命令不在 "),e("code",[a._v("$PATH")]),a._v(" 里面，所以不能用。比如，"),e("code",[a._v("cd")]),a._v(" 是 Bash 命令，因此就不能用 "),e("code",[a._v("npx cd")]),a._v("。")]),a._v(" "),e("h2",{attrs:{id:"避免全局安装模块"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#避免全局安装模块"}},[a._v("#")]),a._v(" 避免全局安装模块")]),a._v(" "),e("p",[a._v("除了调用项目内部模块，npx 还能避免全局安装的模块。比如，"),e("code",[a._v("create-react-app")]),a._v(" 这个模块是全局安装，npx 可以运行它，而且不进行全局安装。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx create-react-app my-react-app\n")])])]),e("p",[a._v("上面代码运行时，npx 将 "),e("code",[a._v("create-react-app")]),a._v(" 下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载 "),e("code",[a._v("create-react-app")]),a._v("。")]),a._v(" "),e("p",[a._v("下载全局模块时，npx 允许指定版本。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx uglify-js@3.1.0 main.js -o ./dist/main.js\n")])])]),e("p",[a._v("上面代码指定使用 3.1.0 版本的 "),e("code",[a._v("uglify-js")]),a._v(" 压缩脚本。")]),a._v(" "),e("p",[a._v("注意，只要 npx 后面的模块无法在本地发现，就会"),e("strong",[a._v("下载同名模块")]),a._v("。比如，本地没有安装 "),e("code",[a._v("http-server")]),a._v(" 模块，下面的命令会自动下载该模块，在当前目录启动一个 Web 服务。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx http-server\n")])])]),e("h2",{attrs:{id:"本地模块运行参数"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#本地模块运行参数"}},[a._v("#")]),a._v(" 本地模块运行参数")]),a._v(" "),e("p",[e("strong",[e("code",[a._v("--no-install")]),a._v(" 参数")])]),a._v(" "),e("p",[a._v("如果想让 npx "),e("strong",[a._v("强制使用")]),a._v("本地模块，不下载远程模块，可以使用 "),e("code",[a._v("--no-install")]),a._v(" 参数。如果本地不存在该模块，就会报错。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx --no-install http-server\n")])])]),e("p",[e("strong",[e("code",[a._v("--ignore-existing")]),a._v(" 参数")])]),a._v(" "),e("p",[a._v("反过来，如果"),e("strong",[a._v("忽略")]),a._v("本地的同名模块，强制安装使用远程模块，可以使用 "),e("code",[a._v("--ignore-existing")]),a._v(" 参数。比如，本地已经全局安装了 "),e("code",[a._v("create-react-app")]),a._v("，但还是想使用远程模块，就用这个参数。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx --ignore-existing create-react-app my-react-app\n")])])]),e("h2",{attrs:{id:"使用不同版本的-node"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#使用不同版本的-node"}},[a._v("#")]),a._v(" 使用不同版本的 Node")]),a._v(" "),e("p",[a._v("利用 npx 可以下载模块这个特点，可以指定某个版本的 Node 运行脚本。它的窍门就是使用 npm 的 node 模块。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx node@0.12.8 -v\nv0.12.8\n")])])]),e("p",[a._v("上面命令会使用 0.12.8 版本的 Node 执行脚本。原理是从 npm 下载这个版本的 node，使用后再删掉。")]),a._v(" "),e("p",[a._v("某些场景下，这个方法用来切换 Node 版本，要比 nvm 那样的版本管理器方便一些。")]),a._v(" "),e("h2",{attrs:{id:"p-参数"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#p-参数"}},[a._v("#")]),a._v(" -p 参数")]),a._v(" "),e("p",[e("code",[a._v("-p")]),a._v(" 参数用于指定 npx 所要安装的模块，所以上一节的命令可以写成下面这样。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx -p node@0.12.8 node -v\nv0.12.8\n")])])]),e("p",[a._v("上面命令先指定安装 "),e("code",[a._v("node@0.12.8")]),a._v("，然后再执行 "),e("code",[a._v("node -v")]),a._v(" 命令。")]),a._v(" "),e("p",[e("code",[a._v("-p")]),a._v(" 参数对于需要安装多个模块的场景很有用。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx -p lolcatjs -p cowsay "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("command"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n")])])]),e("h2",{attrs:{id:"c-参数"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#c-参数"}},[a._v("#")]),a._v(" -c 参数")]),a._v(" "),e("p",[a._v("如果 npx 安装多个模块，默认情况下，所执行的命令之中，只有第一个可执行项会使用 npx 安装的模块，后面的可执行项还是会交给 Shell 解释。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx -p lolcatjs -p cowsay "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v("'cowsay hello | lolcatjs'")]),a._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 报错")]),a._v("\n")])])]),e("p",[a._v("上面代码中，"),e("code",[a._v("cowsay hello | lolcatjs")]),a._v(" 执行时会报错，原因是第一项 "),e("code",[a._v("cowsay")]),a._v(" 由 npx 解释，而第二项命令 "),e("code",[a._v("localcatjs")]),a._v(" 由 Shell 解释，但是 "),e("code",[a._v("lolcatjs")]),a._v(" 并没有全局安装，所以报错。")]),a._v(" "),e("p",[e("code",[a._v("-c")]),a._v(" 参数可以将所有命令都用 npx 解释。有了它，下面代码就可以正常执行了。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx -p lolcatjs -p cowsay -c "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v("'cowsay hello | lolcatjs'")]),a._v("\n")])])]),e("p",[e("code",[a._v("-c")]),a._v(" 参数的另一个作用，是将环境变量带入所要执行的命令。举例来说，npm 提供当前项目的一些环境变量，可以用下面的命令查看。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("npm")]),a._v(" run "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("env")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[a._v("|")]),a._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[a._v("grep")]),a._v(" npm_\n")])])]),e("p",[e("code",[a._v("-c")]),a._v(" 参数可以把这些 npm 的环境变量带入 npx 命令。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[a._v("$ npx -c "),e("span",{pre:!0,attrs:{class:"token string"}},[a._v("'echo \""),e("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$npm_package_name")]),a._v("\"'")]),a._v("\n")])])]),e("p",[a._v("上面代码会输出当前项目的项目名。")]),a._v(" "),e("h2",{attrs:{id:"直接运行远端脚本"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#直接运行远端脚本"}},[a._v("#")]),a._v(" 直接运行远端脚本")]),a._v(" "),e("p",[a._v("npx 还可以执行 GitHub 上面的模块源码。")]),a._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 执行 Gist 代码")]),a._v("\n$ npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 执行仓库代码")]),a._v("\n$ npx github:piuccio/cowsay hello\n")])])]),e("p",[a._v("注意，远程代码必须是一个模块，即必须包含 "),e("code",[a._v("package.json")]),a._v(" 和入口脚本。")])])}),[],!1,null,null,null);s.default=n.exports}}]);
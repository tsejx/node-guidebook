// process.execArgv 属性返回当 Node.js 进程被启动时，Node.js 特定的命令行选项
// 这些选项在 process.argv 属性返回的数组中不会出现，并且这些选项中不会包括 Node.js 的可执行脚本名称或者任何在脚本名称后面出现的选项
// 这些选项在创建子进程时是有用的，因为他们包含了与父进程一样的执行环境信息

// 执行
// $ node --harmony script.js --version
// 输出：
// ['--harmony']
// process.argv 结果
// ['/usr/local/bin/node', 'script.js', '--version']

// process.exit() 方法以退出状态 code 指示 Node.js 同步地终止进程

// 如果省略 code，则使用成功代码 0 或 process.exitCode 的值（如果已设置）退出

// 在调用所有的 'exit' 事件监听器之前，Node.js 不会终止。

// 调用 process.exit() 将强制进程尽快退出，即使还有尚未完全完成的异步操作，包括对 process.stdout 和 process.stderr 的 I/O 操作

// 在大多数情况下，实际上不必显式地调用 process.exit()。 如果事件循环中没有待处理的额外工作，则 Node.js 进程将自行退出

// process.exitCode 属性可以设置为告诉进程当进程正常退出时使用哪个退出码

// 如何正确设置退出码，同时让进程正常退出。
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}

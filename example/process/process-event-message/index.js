/**
 * 证明 Process 'message' 事件的 Node.js 程序
 */
const cp = require("child_process");

// 1. 初始化子进程
const forked = cp.fork(`${__dirname}/child.js`)

// 2. 父进程利用全局全局对象 process 向衍生的子进程发送消息
forked.send({ hello: "world" })
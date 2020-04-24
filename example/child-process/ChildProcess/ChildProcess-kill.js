// 该方法会向子进程发送一个信号
// 如果没有给定参数，则进程将会发送 'SIGTERM' 信号
const spawn = require('child_process').spawn;
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
    console.log(`子进程因收到信号 ${signal} 而终止`);
});

// 发送 SIGHUP 到进程
grep.kill('SIGHUP');

// 虽然该函数被称为 kill，但传给子进程的信号可能实际上不会终止该进程


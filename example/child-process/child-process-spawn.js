const { spawn } = require('child_process');

/**
 * Example 1
 */
const child1 = spawn('pwd', {
  // 通过子进程和当前进程共用 stdio 的方式实现
  stdio: 'inherit',
});

/**
 * Example 2
 */
// 如果需要传递参数的话，应该采用数组的方式传入
const child2 = spawn('ls', ['-l']);
// 通过管道建立连接
child2.stdout.pipe(process.stdout);

child1.on('exit', function(code, signal) {
  console.log('child process exited with' + `code ${code} and signal ${signal}`);
});

// 创建异步的进程
// child_process.exec(command [, options] [, callback])

const { exec } = require('child_process');

exec('ls -l | wc -l', function(err, stdout, stderr) {
  console.log(stdout);
});

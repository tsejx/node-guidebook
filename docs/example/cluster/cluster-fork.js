const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

// 判断是否 Master 进程，是则 fork 子进程，否则启动一个 server
// 每个 HTTP Server 都能监听到同一个端口
if (cluster.isMaster) {
  for (var i = 0; i &lt; numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  http.createServer(function (req, res) {
    res.writeHead(200);
    res.end('Hello world\n');
  }).listen(8000);
}
const http = require('http');
const util = require('util');

const server = http.createServer();

server.on('connection', stream => {
  console.log('有连接!');
});

console.log(util.inspect(server.listeners('connection')));
// 输出：[ [Function: connectionListener], [Function] ]

const fs = require('fs');

// 通过创建一个可读流
const rs = fs.createReadStream('./read-stream.txt', {
  // 我们要对文件进行何种操作
  flags: 'r',
  // 权限位
  mode: 0o666,
  // 不传默认位 buffer，显示位字符串
  encoding: 'utf8',
  // 从索引位 3 的位置开始读
  start: 3,
  // 这是我见过唯一一个包括结束索引的
  // 读到索引为 8 结束
  end: 8,
  // 缓冲区大小
  highWaterMark: 3,
});

rs.on('open', function() {
  console.log('打开文件');
});

// 显示为字符串
rs.setEncoding('utf8');

// 希望流有一个暂停和恢复触发的机制
rs.on('data', function(data) {
  console.log(data);

  // 暂停读取和发射 data 事件
  rs.pause();

  setTimeout(function() {
    // 恢复读取并触发 data 事件
    rs.resume();
  }, 2000);
});

// 如果读取文件出错了，会触发 error 事件
rs.on('error', function() {
  console.log('发生错误');
});

rs.on('close', function() {
  console.log('文件关闭');
});

// process.stdin 属性返回连接到 stdin 的流
// 它是一个 net.Socket 流（也就是双工流），除非 fd0 指向一个文件，在这种情况下它是一个可读流

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  // 使用循环确保我们读取所有的可用数据
  while ((chunk = process.stdin.read()) !== null) {
    process.stdout.write(`数据：${chunk}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('结束');
});

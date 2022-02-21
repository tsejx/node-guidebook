const fs = require('fs');

// 创建一个文件可写流
const ws = fs.createWriteStream('../public/index.txt', {
  highWaterMark: 3,
});

// 往流中写入数据
// 由于上述设置的缓冲区大小为 3 字节，所以到写入第 3 个时，就放回了 false
console.log(ws.write('1', 'utf8'));
console.log(ws.write('2', 'utf8'));
console.log(ws.write('3', 'utf8'));
console.log(ws.write('4', 'utf8'));

function writeData() {
  let cnt = 9;
  return function() {
    let flag = true;
    while (cnt && flag) {
      flag = ws.write(`${cnt}`);
      console.log('缓冲区中写入的字节数：', ws.writableLength);
      cnt--;
    }
  };
}

let wd = writeData();
wd();

// 当缓冲区中的数据满的时候，应停止写入数据
// 一旦缓冲区中的数据写入文件，并清空了，则会触发 `drain` 事件，告诉生产者可以继续写数据了
ws.on('drain', function() {
  console.log('可以继续写数据了');
  console.log('缓冲区中写入的字节数', ws.writableLength);
  wd();
});

// 当流或底层资源关闭时触发
ws.on('close', function() {
  console.log('文件被关闭');
});

// 当写入数据出错时触发
ws.on('error', function() {
  console.log('写入数据错误');
});

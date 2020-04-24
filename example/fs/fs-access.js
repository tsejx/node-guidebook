const fs = require('fs');
const path = require('path');

const demo = path.resolve('./demo/demo.js');
console.log(demo);

// 检测用户对 path 指定的文件或目录的权限
// mode 参数是一个可选的整数，指定要执行的可访问性检查
// mode 可选的值参数「文件可访问性的常量」
// 可以创建由两个或更多个值按位或组成的掩码（例如：fs.constants.W_OK | fs.constants.R_OK）

// 检查当前目录中是否存在该文件
fs.access(demo, fs.constants.F_OK, err => {
  console.log(`${demo} ${err ? '不存在' : '存在'}`);
});

// 检查文件是否可读
fs.access(demo, fs.constants.R_OK, err => {
  console.log(`${demo} ${err ? '不可读' : '可读'}`);
});

// 检查文件是否可写
fs.access(demo, fs.constants.W_OK, err => {
  console.log(`${demo} ${err ? '不可写' : '可写'}`);
});

// 检查当前目录中是否存在该文件，以及该文件是否可写
fs.access(demo, fs.constants.F_OK | fs.constants.W_OK, err => {
  if (err) {
    console.error(`${demo} ${err.code === 'ENOENT' ? '不存在' : '只可读性'}`);
  } else {
    console.log(`${demo}存在，且它是可写的`);
  }
});

// 不建议在调用 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.access() 检查文件的可访问性。 这样做会引入竞态条件，因为其他进程可能会在两个调用之间更改文件的状态。 相反，应该直接打开、读取或写入文件，如果文件无法访问则处理引发的错误。

// 写入（推荐）
fs.open(demo, 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('demo 已存在');
      return;
    }

    throw Error;
  }

  // do something to write file.
  // fs.writeFile(demo, 'abc');
});

// 读取
fs.open(demo, 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`${demo} 不存在`);
      return;
    }

    throw err;
  }

  // do something to write file.
  // fs.writeFile(file, 'abc');
});

// 通常，仅在不直接使用文件时才检查文件的可访问性，例如当其可访问性是来自其他进程的信号时。
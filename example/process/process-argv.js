// 获取启动 Node.js 进程时传入的命令行参数
// 第一个元素是 process.execPath
// 第二个元素是将是正在执行的 JavaScript 文件的路径
// 其余元素将是任何其他命令行参数
const argv = process.argv;

// 启动 Node.js 进程
// $ node process-argv.js one two=three four
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
// 0: /usr/local/bin/node
// 1: /Users/mrsingsing/Descktop/mrsingsing/node-guidebook/example/process/process-argv.js 当前文件的绝对路径
// 2: one
// 3: two=three
// 4: four

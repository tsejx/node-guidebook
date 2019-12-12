// 该方法用于变更 Node.js 进程的当前工作目录
// 如果变更目录失败会抛出异常（例如：指定的 directory 不存在）
console.log(`Starting directory: ${process.cwd()}`);

try {
  process.chdir('/tmp');
  console.log(`New directory: ${process.cwd()}`);
} catch (err) {
  console.log(`chdir: ${err}`);
}

// 注意：该特性在 Worker 线程中不可用
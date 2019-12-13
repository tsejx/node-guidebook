// process.umask() 方法用于返回或设置 Node.js 进程的默认创建文件的权限掩码
// 子进程从父进程集成这个掩码
// 不传参数时，默认返回当前掩码，如果传递了参数，创建文件掩码就被设置为参数值，并且返回之前的掩码

const newmask = 0o022;
const oldmask = process.umask(newmask);

console.log(`将 umask 从 ${oldmask.toString(8)} 更改为 ${newmask.toString(8)}`);
// 输出（示例）：将 umask 从 22 更改为 22

// Worker 线程能够读取 umask，但是尝试设置 umask 将会导致抛出异常

// process.geteuid() 方法返回 Node.js 进程的有效数字标记的用户身份
//参阅 geteuid(2)：http://nodejs.cn/s/CipYot

if (process.geteuid) {
  console.log(`当前的 uid: ${process.geteuid()}`);
  // 输出（示例）：当前的 uid: 501
}

// 这个函数只在 POSIX 平台有效（在 Windows 或 Android 平台无效）。

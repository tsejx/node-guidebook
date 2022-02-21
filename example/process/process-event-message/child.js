const process = require("process");

// Message 事件
process.on("message", (msg) => {
  // 3. 子进程接收到父进程发送的消息
  console.log("CHILD got message:", msg);

  process.exit(0);
})
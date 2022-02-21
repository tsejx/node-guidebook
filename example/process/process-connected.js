// 如果 Node.js 进程是由 IPC 通道（参阅子进程和集群的文档）的方式创建，则只要 IPC 通道保持连接， process.connected 属性就会返回 true。

// process.disconnect() 被调用后，此属性会返回 false。

// 一旦 process.connected 为 false，则不能通过 IPC 通道使用 process.send() 发送信息。

const connected = process.connected;

console.log(connected);
// 输出（非 IPC 通道进程）：undefined
// 输出（IPC 通道创建进程）：true
// 输出（IPC 通道创建然后断开连接）:false

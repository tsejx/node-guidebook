// 如果 Node.js 是使用 IPC 通道衍生的，则可以使用 process.send() 方法将消息发送到父进程。 消息将会作为父进程的 ChildProcess 对象上的 'message' 事件被接收。

// 如果 Node.js 不是通过 IPC 通道衍生的，则 process.send() 将会是 undefined。

// 消息会进行序列化和解析。 生成的消息可能与最初发送的消息不同。

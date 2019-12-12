// 如果 Node.js 进程是由 IPC 通道方式创建的，那么该属性保存 IPC 通道的引用
// 如果 IPC 通道不存在，则该属性值为 undefined
const channel = process.channel;

console.log(channel);
// undefined
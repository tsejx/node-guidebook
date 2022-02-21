// process.stdout 属性返回连接到 stdout (fd 1) 的流

// 它是一个 net.Socket 流（也就是双工流），除非 fd 1 指向一个文件，在这种情况下它是一个可写流

// 例如：将 process.stdin 拷贝到 process.stdout
process.stdin.pipe(process.stdout);

// process.stderr 属性返回连接到 stderr 的流
// 它是一个 net.Socket 流（也就是双工流），除非 fd 2 指向一个文件，在这种情况下它是一个可写流

// process.stderr 与其他的 Node.js 流有重大区别
// 有关更多信息，参阅有关「进程 I/O 的注意事项」：http://nodejs.cn/s/u5R9ap
const stderr = process.stderr;

console.log(stderr);
// 输出（示例）：
// WriteStream {
//   connecting: false,
//   _hadError: false,
//   _handle: TTY { owner: [Circular], onread: [Function: onread] },
//   _parent: null,
//   _host: null,
//   _readableState:
//      ReadableState {
//        objectMode: false,
//        highWaterMark: 16384,
//        buffer: BufferList { length: 0 },
//        length: 0,
//        pipes: null,
//        pipesCount: 0,
//        flowing: null,
//        ended: false,
//        endEmitted: false,
//        reading: false,
//        errorEmitted: false,
//        sync: true,
//        needReadable: false,
//        emittedReadable: false,
//        readableListening: false,
//        resumeScheduled: false,
//        emitClose: false,
//        destroyed: false,
//        defaultEncoding: 'utf8',
//        awaitDrain: 0,
//        readingMore: false,
//        decoder: null,
//       encoding: null
//   },
//   readable: false,
//   _events: { end: [Function: onReadableStreamEnd] },
//   _eventsCount: 1,
//   _maxListeners: undefined,
//   _writableState:
//      WritableState {
//        objectMode: false,
//        highWaterMark: 16384,
//        finalCalled: false,
//        needDrain: false,
//        ending: false,
//        ended: false,
//        finished: false,
//        destroyed: false,
//        decodeStrings: false,
//        defaultEncoding: 'utf8',
//        length: 0,
//        writing: false,
//        corked: 0,
//        sync: true,
//        bufferProcessing: false,
//        onwrite: [Function: bound onwrite],
//        writecb: null,
//        writelen: 0,
//        bufferedRequest: null,
//        lastBufferedRequest: null,
//        pendingcb: 0,
//        prefinished: false,
//        errorEmitted: false,
//        emitClose: false,
//        bufferedRequestCount: 0,
//        corkedRequestsFree:
//         { next: null,
//           entry: null,
//         finish: [Function: bound onCorkedFinish]
//     }
//   },
//   writable: true,
//   allowHalfOpen: false,
//   _sockname: null,
//   _writev: null,
//   _pendingData: null,
//   _pendingEncoding: '',
//   server: null,
//   _server: null,
//   columns: 80,
//   rows: 25,
//   _type: 'tty',
//   fd: 2,
//   _isStdio: true,
//   destroySoon: [Function: destroy],
//   _destroy: [Function],
//   [Symbol(asyncId)]: 5,
//   [Symbol(lastWriteQueueSize)]: 0,
//   [Symbol(timeout)]: null,
//   [Symbol(kBytesRead)]: 0,
//   [Symbol(kBytesWritten)]: 0
// }

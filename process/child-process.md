# 子进程

子进程 (Child Process) 是进程中一个重要的概念. 你可以通过 Node.js 的 `child_process` 模块来执行可执行文件，调用命令行命令，比如其他语言的程序等。也可以通过该模块来将 JavaScript 代码以子进程的方式启动。比较有名的网易的分布式架构 [pomelo](https://github.com/NetEase/pomelo) 就是基于该模块 (而不是 cluster) 来实现多进程分布式架构的。

> child_process.fork 与 POSIX 的 fork 有什么区别?

Node.js 的 `child_process.fork()` 在 Unix 上的实现最终调用了 POSIX fork(2)，而 POSIX 的 fork 需要手动管理子进程的资源释放（waitpid），`child_process.fork` 则不用关心这个问题，Node.js 会自动释放，并且可以在 option 中选择父进程死后是否允许子进程存活。


## 创建子进程

child_process 模块提供了几种创建子进程的方式：

- `spawn()`：启动一个子进程来执行命令
  - options.detached 父进程死后是否允许子进程存活
  - options.stdio 指定子进程的三个标准流
- `spawnSync()`：同步版的 spawn，可指定超时，返回的对象可获得子进程的情况
- `exec()`：启动一个子进程来执行命令，带回调参数获知子进程的情况，可指定进程运行的超时时间
- `execSync()`：同步版的 exec()，可指定超时，返回子进程的输出 (stdout)
- `execFile()`：启动一个子进程来执行一个可执行文件，可指定进程运行的超时时间
- `execFileSync()`：同步版的 execFile()，返回子进程的输出，如何超时或者 exit code 不为 0，会直接 throw Error
- `fork()`：加强版的 spawn()，返回值是 ChildProcess 对象可以与子进程交互

其中 `exec/execSync` 方法会直接调用 bash 来解释命令，所以如果有命令有外部参数，则需要注意被注入的情况。

```js
// 使用 spawn 创建子进程
const { spawn } = require('child_process');
const child = spawn('pwd');
```

pwd 是 shell 的命令，用于获取当前的目录，上面的代码执行完控制台并没有任何的信息输出，这是为什么呢？

控制台之所以不能看到输出信息的原因是由于子进程有自己的 stdio 流（stdin、stdout、stderr），控制台的输出是与当前进程的 stdio 绑定的，因此如果希望看到输出信息，可以通过在子进程的 stdout 与当前进程的 stdout 之间建立管道实现。

```js
child.stdout.pipe(process.stdout);
```

也可以监听事件的方式（子进程的 stdio 流都是实现了 EventEmitter API 的，所以可以添加事件监听）

```js
child.stdout.on('data', function(data){
    process.stdout.write(data);
});
```

在 Node.js 代码里使用 console.log 其实底层依赖的就是 process.stdout。

除了建立管道之外，还可以通过子进程和当前进程共用 stdio 的方式来实现：

```js
const { spawn } = require('child_process');
const child = spawn('pwd', {
    stdio: 'inherit'
})
```

stdio 选项用于配置父进程和子进程之间建立的管道，由于 stdio 管道有三个（stdin、stdout 和 stderr）。因此 stdio 的三个可能的值其实是数组的一种简写。

- pipe 相当于 `['piepe', 'pipe', 'pipe']`（默认值）
- ignore 相当于 `['ignore', 'ignore', 'ignore']`
- inherit 相当于 `[process.stdin, process.stdout, process.stderr]`

由于 inherit 方式使得子进程直接使用父进程的 stdio，因此可以看到输出。

ignore 用于忽略子进程的输出（将 `/dev/null` 指定为子进程的文件描述符了），因此当 ignore 时  child.stdout 是 null。




## child.kill 与 child.send

常见会问的面试题，如 `child.kill` 与 `child.send` 的区别. 二者一个是基于信号系统，一个是基于 IPC。


## 孤儿进程

> 父进程或子进程的死亡是否会影响对方? 什么是孤儿进程?

子进程死亡不会影响父进程，不过子进程死亡时（线程组的最后一个线程，通常是“领头”线程死亡时），会向它的父进程发送死亡信号. 反之父进程死亡，一般情况下子进程也会随之死亡，但如果此时子进程处于可运行态、僵死状态等等的话，子进程将被进程 1（init 进程）收养，从而成为孤儿进程. 另外，子进程死亡的时候（处于“终止状态”），父进程没有及时调用 wait() 或 waitpid() 来返回死亡进程的相关信息，此时子进程还有一个 PCB 残留在进程表中，被称作僵尸进程。


// process.env 属性返回包含用户环境的对象
const env = process.env;

console.log(env);
// 输出（示例）：
// {
//   TERM: 'xterm-256color',
//   SHELL: '/usr/local/bin/bash',
//   USER: 'maciej',
//   PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
//   PWD: '/Users/maciej',
//   EDITOR: 'vim',
//   SHLVL: '1',
//   HOME: '/Users/maciej',
//   LOGNAME: 'maciej',
//   _: '/usr/local/bin/node',
// }

// 在 process.env 上分配属性将隐式地将值转换为字符串。 不推荐使用此行为
// 当值不是字符串、数字或布尔值时，Node.js 的未来版本可能会抛出错误。

process.env.test = null;
console.log(process.env.test);
// 输出：'null'

// 使用 delete 可以从 process.env 中删除属性
process.env.TEST = 1;
delete process.env.TEST;
console.log(process.env.TEST);
// 输出（示例）：undefined

// 除非在创建 Worker 实例时明确指定，否则每个 Worker 线程都有自己的 process.env 副本，基于其父线程的 process.env，或者指定为 Worker 构造函数的 env 选项的任何内容
// 对于 process.env 的更改将在 Worker 线程中不可见，并且只有主线程可以进行对操作系统或本机加载项可见的更改
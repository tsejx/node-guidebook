// process.dlopen(module, filename [, flags]) 方法允许动态加载共享对象
// 它主要由 require() 用于加载 C++ 插件，除特殊情况外，不应直接使用
// 换句话说，除非有特殊原因，否则 require() 应优先于 process.dlopen() 。

// flags 参数是一个允许指定 dlopen 行为的整数
// 有关详细信息，请参阅 os.constants.dlopen 文档。

// 如果有特定原因要使用 process.dlopen()（例如，指定 dlopen 标志），使用 require.resolve() 来查找模块的路径通常很有用。

// 调用 process.dlopen() 时的一个重要缺点是必须传入 module 实例。 可以通过 module.exports 访问 C++ 插件导出的函数。

// 下面的示例显示了如何加载导出 foo 函数的名为 binding 的 C++ 插件。 通过传入 RTLD_NOW 常量，将在调用返回之前加载所有符号。 在此示例中，假定常量可用。
const os = require('os');

process.dlopen(module, require.resolve('binding'), os.constants.dlopen.RTLD_NOW);

module.exports.foo();
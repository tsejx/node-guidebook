// 所有模块都提供这些对象。以下对象虽然看起来是全局的，但其实并不是

// 当前模块的目录名，与 __filename 的 path.dirname() 相同
console.log(__dirname);

// 当前模块的文件名，这是当前的模块文件的绝对路径（符号链接会被解析）
console.log(__filename);

// 对于 `module.exports` 的更简短的引用形式
console.log(exports);

// 当前模块的引用
console.log(module);

// 用于引入模块、JSON 或本地文件
// 可以从 `node_modules` 引入模块
// 可以使用相对路径引入本地模块或 JSON 文件，路径会根据 `__dirname` 定义的目录名或当前工作目录进行处理
console.log(require);

// 此处列出的对象特定于 Node.js
// 有些内置对象是 JavaScript 语言本身的一部分，它们也是全局可访问的

// 除此之外，全局变量挂载了定时器的相关方法，包括：
// setTimeout
// setInterval
// setImmediate
// clearTimeout
// claerInterval
// clearImmediate
// 由于这些方法属于定时模块，所以放在定时器模块展示
console.log(global);

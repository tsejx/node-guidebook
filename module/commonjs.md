# CommonJS

Node 应用由模块组成，采用 CommonJS 模块规范。

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

如果想在多个文件分享变量，必须定义为 `global` 对象的属性。

CommonJS 规范规定，每个模块内部，`module` 变量代表当前模块。这个变量是一个对象，它的 `exports` 属性（即 `module.exports`）是对外的接口。加载某个模块，其实是加载该模块的 `module.exports` 属性。

CommonJS 模块的特点：

- 所有代码都运行在模块作用域，不会污染全局作用域
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存
- 模块加载的顺序，按照其在代码中出现的顺序

## module

Node 内部提供一个 Module 构建函数。所有模块都是 Module 的实例。

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
}
```

每个模块内部，都有一个 `module` 对象，代表当前模块。它有以下属性。

- `module.id`：模块的识别符，通常是带有绝对路径的模块文件名
- `module.filename`：模块的文件名，带有绝对路径
- `module.loaded`：返回一个布尔值，表示模块是否已经完成加载
- `module.parent`：返回一个对象，表示调用该模块的模块
- `module.children`：返回一个数组，表示该模块要用到的其他模块
- `module.exports`：表示模块对外输出的值

🌰 **示例：**

```js
// index.js
const jquery = require('jquery');
exports.$ = jquery;
console.log(module);
```

执行该文件，命令行会输出如下信息。

```js
{
  id: '.',
  exports: { '$': [Function] },
  parent: null,
  filename: '/path/to/example.js',
  loaded: false,
  children: [
      { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object]
      }
    ],
  paths: [
     '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules'
  ]
}
```

- 若在命令行下调用该模块，比如 `node index.js`，则 `module.parent` 为 `null`。
- 若在脚本之中调用，比如 `require('./index.js)`，则 `module.parent` 就是调用它的模块。

利用这一点，可以判断当前模块是否为入口脚本。

```js
if (!module.parent) {
  // ran with `node index.js`
  app.listen(8080, function() {
    console.log('app listening on port 8080');
  });
} else {
  // used with `require('./index.js')`
  module.exports = app;
}
```

### module.exports 属性

`module.exports` 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 `module.exports` 变量。

```js
const EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

setTimeout(function() {
  module.exports.emit('ready');
}, 1000);
```

上述模块会在加载后 1 秒后，发出 ready 事件。其他文件监听该事件，可以写成下面这样。

```js
const foo = require('./foo');
foo.on('ready', function() {
  console.log('module foo is ready');
});
```

### exports 变量

为了方便，Node 为每个模块提供了一个 exports 变量，指向 `module.exports`。这等同在每个模块头部，有这样一行命令。

```js
var exports = module.exports;
```

因此，在对外输出模块接口时，可以像 exports 对象添加方法。

```js
exports.area = function(r) {
  return Math.PI * r * r;
};

exports.circumference = function(r) {
  return 2 * Math.PI * r;
};
```

注意，不能将 exports 变量直接指向一个值，因为这样等于断了 `exports` 和 `module.exports` 的联系。

以下写法是无效的。

```js
exports = function(x) {
  console.log(x);
};
```

下面的写法也是无效的。

```js
exports.hello = function() {
  return 'hello';
};

module.exports = 'Hello world!';
```

上面代码，`hello` 函数是无法对外输出的，因为 `module.exports` 被重新赋值了。

这意味着，如果一个模块的对外接口，就是一个单一的值，不能使用 `exports` 输出，只能使用 `module.exports` 输出。

如果觉得 `exports` 和 `module.exports` 之间的区别很难分清，一个简单的处理方法，就是放弃使用 `exports`，只使用 `module.exports`。

## require

Node 使用 CommonJS 模块规范，内置的 `require` 命令用于加载模块文件。

`require` 命令的基本功能就是，读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。

```js
// index.js
var invisible = function() {
  console.log('invisible');
};

exports.message = 'hi';

exports.say = function() {
  console.log(message);
};
```

如果模块输出的是一个函数，那就不能定义在 exports 对象上，而要定义在 `module.exports` 变量上。

```js
module.exports = function() {
  console.log('hello world!');
};

require('./index.js');
```

上面代码中，require 命令调用自身，等于是执行 `module.exports`，因此会输出 `hello world!`。

### 加载规则

`require` 命令用于加载文件，后缀名默认为 `.js`。

```js
var foo = require('foo');
//  等同于
var foo = require('foo.js');
```

根据参数的不同格式，`require` 命令去不同路径寻找模块文件。

1. 如果参数字符串以 `/` 开头，则表示加载的是一个位于**绝对路径**的模块文件。比如，`require('/home/marco/foo.js')` 将加载 `/home/marco/foo.js`。

2. 如果参数字符串以 `./` 开头，则表示加载的是一个位于**相对路径**（跟当前执行脚本的位置相比）的模块文件。比如，`require('./foo')` 将加载当前脚本同一目录的 `foo.js`。

3. 如果参数字符串不以 `./` 或 `/` 开头，则表示加载的是一个**默认提供的核心模块**（位于 Node 的系统安装目录中），或者一个位于各级 `node_modules` 目录的已安装模块（全局安装或局部安装）。

举例来说，脚本 `/home/user/projects/foo.js` 执行了 `require('bar.js')` 命令，Node 会依次搜索以下文件：

```bash
# node 安装全局依赖的目录
/usr/local/lib/node/bar.js
# 当前文件夹依赖目录
/home/user/projects/node_modules/bar.js
# 父目录依赖目录
/home/user/node_modules/bar.js
# 父目录的父目录依赖目录
/home/node_modules/bar.js
# 沿路径向上逐级递归，直到根目录下的依赖目录
/node_modules/bar.js
```

这种路径的生成方式与 JavaScript 的原型链或作用域的查找方式十分类似。在加载的过程中，Node 会逐个尝试模块路径中的路径，直到找到目标文件为止。可以看出，当前文件的路径越深，模块查找耗时会越多，这是自定义模块的加载速度是最慢的原因。

4. 如果参数字符串不以 `./` 或 `/` 开头，而且是一个路径，比如 `require('example/path/to/file')`，则将先找到 `example` 的位置，然后再以它为参数，找到后续路径。

5. 如果指定的模块文件没有发现，Node 会尝试为文件名添加 `.js`、`.json`、`.node` 后，再去搜索。`.js` 件会以文本格式的 JavaScript 脚本文件解析，`.json` 文件会以 JSON 格式的文本文件解析，`.node` 文件会以编译后的二进制文件解析。

6. 如果想得到 require 命令加载的确切文件名，使用 `require.resolve()` 方法。

7. 如果参数字符串为目录的路径，则自动查找该文件夹下的 `package.json` 文件，然后再加载该文件当中 main 字段所指定的入口文件（若没有 `package.json` 文件或该文件中无 main 字段，则默认查找该文件夹下的 `index.js` 文件作为模块来载入）

⚠️ 注意：Node 的系统模块的优先级最高，一旦有第三方模块包与核心模块重名，则以核心模块为准

### 目录的加载规则

通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个入口文件，让 `require` 方法可以通过这个入口文件，加载整个目录。

在目录中放置一个 `package.json` 文件，并且将入口文件写入 `main` 字段。下面是一个例子。

```json
{
  "name": "some-library",
  "main": "./lib/some-library.js"
}
```

`require` 发现参数字符串指向一个目录以后，会自动查看该目录的 `package.json` 文件，然后加载 `main` 字段指定的入口文件。如果 `package.json` 文件没有 `main` 字段，或者根本就没有 `package.json` 文件，则会加载该目录下的 `index.js` 文件或 `index.node` 文件。

### 模块的缓存

第一次加载某个模块时，Node 会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的 `module.exports` 属性。

```js
require('./example.js');
require('./example.js').message = 'hello';
require('./example.js').message;
// "hello"
```

上面代码中，连续三次使用 `require` 命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个 `message` 属性。但是第三次加载的时候，这个 `message` 属性依然存在，这就证明 `require` 命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以让该模块输出一个**函数**，然后每次 `require` 这个模块的时候，重新执行一下输出的函数。

所有缓存的模块保存在 `require.cache` 之中，如果想删除模块的缓存，可以像下面这样写。

```js
// 删除指定模块的缓存
delete require.cache[moduleName];

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
});
```

注意，缓存是根据**绝对路径**识别模块的，如果同样的模块名，但是保存在不同的路径，`require` 命令还是会重新加载该模块。

### 模块的循环加载

如果发生模块的循环加载，即 `foo` 加载 `bar`，`bar` 又加载 `foo`，则 `bar` 将加载 `foo` 的不完整版本。

```js
// foo.js
console.log('foo start');
exports.done = false;
const bar = require('./bar');
console.log('在 foo 中，bar.done = %j', bar.done);
exports.done = true;
console.log('foo end');

// bar.js
console.log('bar start');
exports.done = false;
const foo = require('./foo');
console.log('在 bar 中，foo.done = %j', foo.done);
exports.done = true;
console.log('bar end');

// main.js
console.log('main start');
const foo = require('./foo');
const bar = require('./bar');
console.log('在 main 中，foo.done=%j，bar.done=%j', foo.done, bar.done);
```

当 `main.js` 加载 `foo.js` 时，`foo.js` 又加载 `bar.js`。 此时，`bar.js` 会尝试去加载 `foo.js`。 为了防止无限的循环，会返回一个 `foo.js` 的 exports 对象的 未完成的副本给 `bar.js` 模块。 然后 `bar.js` 完成加载，并将 exports 对象提供给 `foo.js` 模块。

```bash
$ node main.js
main start
foo start
bar start
在 bar 中，a.done = false
bar 结束
在 foo 中，b.done = true
foo 结束
在 main 中，a.done=true，b.done=true
```

### require.main

`require` 方法有一个 `main` 属性，可以用来判断模块是直接执行，还是被调用执行。

直接执行的时候（`node module.js`），`require.main` 属性指向模块本身。

```js
require.main === module;
// true
```

调用执行的时候（通过 `require` 加载该脚本执行），上面的表达式返回 `false`。

---

**参考资料：**

- [📖 Wiki：CommonJS](http://wiki.commonjs.org/wiki/CommonJS)

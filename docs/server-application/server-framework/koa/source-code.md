---
nav:
  title: 服务端应用
  order: 5
group:
  title: Koa
  path: /server-framework/koa
  order: 11
title: 源码解析
order: 2
---

# 源码解析

## 工作流程

Koa 的工作流程分为三个步骤：`初始化 -> 启动 server -> 请求响应`

- 初始化
  - 初始化 Koa 对象之前我们称为初始化
- 启动 Server
  - 初始化中间件（中间件建立联系）
  - 启动服务，监听特定端口，并生成一个新的上下文对象
- 请求响应
  - 接受请求，初始化上下文对象
  - 执行中间件
  - 将 `body` 返回给客户端

简单来说，可以概括为两件事：

1. 为 `reqeust` 和 `response` 对象赋能，并基于它们封装成一个 `context` 对象
2. 基于 `async/await` 的中间讲容器机制

## 源码结构

源码结构:

```bash
Koa
└── lib
    ├── application.js
    ├── context.js
    ├── request.js
    └── response.js
```

上图是 Koa2 的源码目录结构的 `lib` 文件夹，`lib` 文件夹下放着四个 Koa2 的核心文件：

- `application.js`
- `context.js`
- `request.js`
- `response.js`。

### 应用程序

`application.js` 是 Koa 的入口文件，它向外导出了创建 `Class` 实例的构造函数，它继承了 Events，这样就会赋予框架 `事件监听` 和 `事件触发` 的能力。

`application.js` 还暴露了一些常用的 API，比如 `toJSON`、`listen`、`use` 等等。

- `listen` 的实现原理其实就是对 `http.createServer` 进行了一个封装，重点是这个函数中传入的 `callback`，它里面包含了 **中间件的合并**，**上下文的处理**，对 `res` 的特殊处理。
- `use` 是收集中间件，将多个中间件放入一个 **缓存队列** 中，然后通过 `Koa-compose` 这个插件进行递归组合调用这一些列的中间件。

```js
// 引入第三方库，实际不仅是下面几个，列出来的几个是比较关键的

// Node 实现 Web 服务器功能的核心库
const http = require('http');
// Node的基础库，Koa 应用集成于它，主要用了其事件机制，来实现异常的处理
const Emitter = require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');
// 实现基于 async/await 洋葱模型的调用顺序的中间件容器的关键库
const compose = require('koa-compose');
// 为了支持 Koa1 的 Generator 中间件写法，对于使用 Generator 函数实现的中间件函数，需要通过 koa-convert 转换
const convert = require('koa-convert');

// Application 类继承了 Node.js 的 events 模块 `Emitter`，所以拥有了事件系统的能力
module.exports = class Application extends Emitter {
  constructor() {
    // 调用父类 Emitter，拥有了事件系统的能力
    super();
    // 该数组存放所有通过 use 函数引入的中间件函数
    this.middleware = [];
    // 上下文对象，继承从 context.js 文件导出的对象
    this.context = Object.create(context);
    // 请求对象，继承从 request.js 文件导出的对象
    this.request = Object.create(request);
    // 响应对象，继承从 response.js 文件导出的对象
    this.response = Object.create(response);
  }

  // 创建服务器实例，监听宿主机端口
  listen(...args) {
    debug('listen');

    // 通过执行 callback 函数返回的函数来作为处理每次请求的回调函数
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /*
    通过调用 Koa 应用实例的 use 函数，形如：
    app.use(async (ctx, next) => {
        await next();
    });
    来加入中间件
  */
  use(fn) {
    // 如果是 Generator 函数，则需要通过 koa-convert 转换成类似类 async/await 函数
    // 其核心原理是将 Generator 函数和自动执行器，包装在一个函数里
    if (isGeneratorFunction(fn)) {
      fn = convert(fn);
    }

    // 将中间件加入 middleware 数组中
    this.middleware.push(fn);
    return this;
  }

  // 返回一个形如 (req, res) => {} 的函数，该函数会作为参数传递给上文 listen 函数中的 http.createServer 函数，作为处理请求的回调函数
  // 具体细节会在下文重点解释
  callback() {
    // 将所有中间件函数通过 koa-compose 组合一下
    const fn = compose(this.middleware);

    // 该函数会作为参数传递给上文 listen 函数中的 http.createServer 函数，
    const handleRequest = (req, res) => {
      // 基于 req 和 res，封装一个更强大的 context 应用上下文对象
      const ctx = this.createContext(req, res);

      // 当有请求过来时，需要基于办好了 request 和 response 信息的 ctx 和所有中间件函数，来处理请求
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    // 处理回调函数的请求
  }

  // 基于 req 和 res 对象，创建 context 应用上下文对象
  createContext(req, res) {
    // 封装新层 request、response 和 context 对象
    // 并将 req 和 res 挂载到 context 对象上
  }
};
```

### 上下文

这部分就是 Koa 的应用上下文 `ctx`，其实就一个简单的对象暴露，里面的重点在 delegate，这个就是 **代理**，这个就是为了开发者方便而设计的，比如我们要访问 `ctx.repsponse.status` 但是我们通过 delegate，可以直接访问 `ctx.status` 访问到它。

```js
const util = require('util');
const createError = require('http-errors');
const httpAssert = require('http-assert');
const delegate = require('delegates');
const statuses = require('statuses');

const proto = module.exports = {
  // 主要是一些方法实现
};

/*
  在 application.js 的 createContext 函数中，
  被创建的 context 对象上会挂载基于 response.js 实现的 response 对象和基于 request.js 实现的 request 对象，
  下面两个 delegate 函数的作用是让 context 对象代理 response 和 request 的部分方法和属性
*/
delegate(proto, 'response')
  .method('attachment')
  ...
  .getter('writable');

/**
 * Request delegation.
 */
delegate(proto, 'request')
  .method('acceptsLanguages')
  ...
  .getter('ip');
```

### 请求和响应对象

这两部分就是对原生的 `res`、`req` 的一些操作了，大量使用 ES6 的 `get` 和 `set` 的一些语法，去取 `headers` 或者设置 `headers`、还有设置 `body` 等等，这些就不详细介绍了，有兴趣的读者可以自行看源码。

```js
module.exports = {
  // 在 application.js 中的 createContext 函数中，会把 Node 服务器的 req 对象作为 request 对象的属性，
  // request 对象会基于 req 封装很多便利的函数和属性
  get header() {
    return this.req.headers;
  },

  set header(val) {
    this.req.headers = val;
  },

  // 省略了大量类似的工具属性和方法
};
```

`response.js` 与 `request.js` 实现类似，主要是基于 Node.js 服务器的 `res` 对象，封装一系列便利的函数和属性。

## 源码实现

上文简述了 koa2 源码的大体框架结构，接下来我们来实现一个 koa2 的框架，笔者认为理解和实现一个 Koa 框架需要实现四个大模块，分别是：

- 封装 Node HTTP Server 并创建 Koa 类构造函数
- 构造 request、response、context 对象
- 中间件机制和剥洋葱模型的实现
- 错误捕获和错误处理

### 封装 HTTP Server

阅读 Koa2 的源码得知，实现 Koa 的服务器应用和端口监听，其实就是基于 Node 的原生代码进行了封装，如下图的代码就是通过 Node 原生代码实现的服务器监听。

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('hello world');
});

server.listen(3000, () => {
  console.log('listenning on 3000');
});
```

我们需要将上面的 Node 原生代码封装实现成 Koa 的模式：

```js
const http = require('http');
const Koa = require('Koa');
const app = new Koa();
app.listen(3000);
```

实现 Koa 的第一步就是对以上的这个过程进行封装，为此我们需要创建 `application.js` 实现一个 Application 类的构造函数：

```js
const http = require('http');

class Application {
  constructor() {
    this.callbackFunc;
  }
  listen(port) {
    let server = http.createServer(this.callback());
    server.listen(port);
  }
  use(fn) {
    this.callbackFunc = fn;
  }
  callback() {
    return (req, res) => {
      this.callbackFunc(req, res);
    };
  }
}

module.exports = Application;
```

然后创建 `example.js`，引入 `application.js`，运行服务器实例启动监听代码：

```js
const Koa = require('./application');
const app = new Koa();

app.use((req, res) => {
  res.writeHead(200);
  res.end('hello world');
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
```

现在在浏览器输入 `localhost:3000` 即可看到浏览器里显示 `hello world`。现在第一步我们已经完成了，对 HTTP Server 进行了简单的封装和创建了一个可以生成 Koa 实例的类 class，这个类里还实现了 `app.use` 用来注册中间件和注册回调函数，`app.listen` 用来开启服务器实例并传入 `callback` 回调函数，第一模块主要是实现典型的 Koa 风格和搭好了一个 Koa 的简单的架子。接下来我们开始编写和讲解第二模块。

### 构造内置模块对象

阅读 Koa2 的源码得知，其中 `context.js`、`request.js`、`response.js` 三个文件分别是 `request`、`response`、`context` 三个模块的代码文件。

`context` 就是我们平时写 Koa 代码时的 `ctx`，它相当于一个全局的 Koa 实例上下文 `this`，它连接了 `request`、`response` 两个功能模块，并且暴露给 Koa 的实例和中间件等回调函数的参数中，起到 `承上启下` 的作用。

`request`、`response` 两个功能模块分别对 Node 的原生 request、response 进行了一个功能的封装，使用了 `getter` 和 `setter` 属性，基于 node 的对象 `req/res` 对象封装 Koa 的 `request/response` 对象。我们基于这个原理简单实现一下 `request.js`、`response.js`，首先创建 `request.js` 文件，然后写入以下代码：

```js
const url = require('url');

module.exports = {
  get query() {
    return url.parse(this.req.url, true).query;
  },
};
```

这样当你在 Koa 实例里使用 `ctx.query` 的时候，就会返回 `url.parse(this.req.url, true).query` 的值。看源码可知，基于 `getter` 和 `setter`，在 `request.js` 里还封装了 `header`、`url`、`origin`、`path` 等方法，都是对原生的 `request` 上用 `getter` 和 `setter` 进行了封装，笔者不再这里一一实现。

接下来我们实现 `response.js` 文件代码模块，它和 `request` 原理一样，也是基于 `getter` 和 `setter` 对原生 `response` 进行了封装，那我们接下来通过对常用的 `ctx.body` 和 `ctx.status` 这个两个语句当做例子简述一下如果实现 Koa 的 `response` 的模块，我们首先创建好 `response.js` 文件，然后输入下面的代码：

```js
module.exports = {
  get body() {
    return this._body;
  },
  set body(data) {
    this._body = data;
  },
  get status() {
    return this.res.statusCode;
  },
  set status(statusCode) {
    if (typeof statusCode !== 'number') {
      throw new Error('something wrong!');
    }
    this.res.statusCode = statusCode;
  },
};
```

以上代码实现了对 Koa 的 `status` 的读取和设置，读取的时候返回的是基于原生的 `response` 对象的 `statusCode` 属性，而 `body` 的读取则是对 `this._body` 进行读写和操作。这里对 `body` 进行操作并没有使用原生的 `this.res.end`，因为在我们编写 Koa 代码的时候，会对 `body` 进行多次的读取和修改，所以真正返回浏览器信息的操作是在 `application.js` 里进行封装和操作。

现在我们已经实现了`request.js`、`response.js`，获取到了 `request`、`response` 对象和他们的封装的方法，然后我们开始实现 `context.js`，context 的作用就是将 `request`、`response` 对象挂载到 `ctx` 的上面，让 Koa 实例和代码能方便的使用到 `request`、`response` 对象中的方法。现在我们创建 `context.js` 文件，输入如下代码：

```js
let proto = {};

function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val;
  });
}

function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name];
  });
}

let requestSet = [];
let requestGet = ['query'];

let responseSet = ['body', 'status'];
let responseGet = responseSet;

requestSet.forEach(ele => {
  delegateSet('request', ele);
});

requestGet.forEach(ele => {
  delegateGet('request', ele);
});

responseSet.forEach(ele => {
  delegateSet('response', ele);
});

responseGet.forEach(ele => {
  delegateGet('response', ele);
});

module.exports = proto;
```

`context.js` 文件主要是对常用的 `request` 和 `response` 方法进行挂载和代理，通过 `context.query` 直接代理了 `context.request.query`，`context.body` 和 `context.status` 代理了 `context.response.body` 与 `context.response.status`。而 `context.request`，`context.response` 则会在 `application.js` 中挂载。

本来可以用简单的 `setter` 和 `getter` 去设置每一个方法，但是由于 `context` 对象定义方法比较简单和规范，在 Koa 源码里可以看到，koa 源码用的是 **defineSetter** 和 **defineSetter** 来代替 `setter/getter` 每一个属性的读取设置，这样做主要是方便拓展和精简了写法，当我们需要代理更多的 `res` 和 `req` 的方法的时候，可以向 `context.js` 文件里面的数组对象里面添加对应的方法名和属性名即可。

目前为止，我们已经得到了 `request`、`response`、`context` 三个模块对象了，接下来就是将 `request`、`response` 所有方法挂载到 `context` 下，让 `context` 实现它的承上启下的作用，修改 `application.js` 文件，添加如下代码：

```js
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

createContext(req, res) {
   let ctx = Object.create(this.context);

   ctx.request = Object.create(this.request);
   ctx.response = Object.create(this.response);
   ctx.req = ctx.request.req = req;
   ctx.res = ctx.response.res = res;

   return ctx;
}
```

可以看到，我们添加了 `createContext` 这个方法，这个方法是关键，它通过 `Object.create` 创建了 `ctx`，并将 `request` 和 `response` 挂载到了 `ctx` 上面，将原生的 `req` 和 `res` 挂载到了 `ctx` 的子属性上，往回看一下 `context/request/response.js` 文件，就能知道当时使用的 `this.res` 或者 `this.response` 之类的是从哪里来的了，原来是在这个 `createContext` 方法中挂载到了对应的实例上，构建了运行时上下文 `ctx` 之后，我们的 `app.use` 回调函数参数就都基于 `ctx` 了。

### 中间件机制

目前为止我们已经成功实现了上下文 `context` 对象、 请求 `request` 对象和响应 `response` 对象模块，还差一个最重要的模块，就是 Koa 的中间件模块，Koa 的中间件机制是一个 `剥洋葱式` 的模型，多个中间件通过 `use` 放进一个数组队列然后从外层开始执行，遇到 `next` 后进入队列中的下一个中间件，所有中间件执行完后开始 **回帧**，执行队列中之前中间件中未执行的代码部分，这就是剥洋葱模型，Koa 的中间件机制。

Koa 的剥洋葱模型在 Koa1 中使用的是 `Generator + co.js` 去实现的，Koa2 则使用了 `async/await + Promise` 去实现的，接下来我们基于 `async/await + Promise` 去实现 Koa2 中的中间件机制。

Koa 的中间件本质就是一个 `async` 函数，形如：

```js
async (ctx, next) => {
  await next();
};
```

该函数接受两个参数：

- `ctx`：即为 `application` 的 `context` 属性，其封装了 `req` 和 `res`
- `next`：该函数用于将程序控制权交由下个中间件

通过 Koa 应用实例的 `use` 函数，可以将中间件加入到 Koa 实例的 `middleware` 数组中。当 Node 服务启动的时候，会通过 `koa-compose` 的 `compose` 函数，将 `middleware` 数组组织成一个 `fn` 对象。当有请求访问时，会调用 `callback` 函数内部的 `handleRequest` 函数，该函数主要做两件事：

- 根据 `req` 和 `res` 创建 `context` 对象
- 执行 Koa 实例的 `handleRequest` 函数（注意区分两个 `handleRequest` 函数）；Koa 实例的 `handleRequest` 函数通过其最后一行代码，开启了中间件函数的洋葱式调用

这里有两个关键细节：

1. `koa-compose` 对 `middleware` 做了什么
2. 如何实现洋葱式调用

首先，假设当 Koa 的中间件机制已经做好了，那么它是能成功运行下面代码的：

```js
const Koa = require('../src/application');

const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(6);
});

app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
});

app.use(async (ctx, next) => {
  console.log(3);
  ctx.body = 'hello world';
  console.log(4);
});

app.listen(3000, () => {
  console.log('listenning on 3000');
});
```

运行成功后会在终端输出 `1 2 3 4 5 6`，那就能验证我们的 Koa 的剥洋葱模型是正确的。

下面我们看 [koa-compose](https://github.com/koajs/compose/blob/master/index.js) 函数的实现：

`compose` 函数接收一个 `middleware` 数组作为参数，返回一个函数，给函数传入 `ctx` 时第一个中间件将自动执行，以后的中间件只有在手动调用 `next`，即 `dispatch` 时才会执行。从代码实现可以看出，中间件的执行是异步的，并且中间件执行完毕后返回的是一个 Promise，每个 `dispatch` 的返回值也是一个 Promise，因此我们的中间件执行完毕后返回的是一个 Promise，每个 `dispatch` 的返回值也是一个 Promise，因此我们的中间件中可以方便地使用 `async` 函数进行定义，内部使用 `await next()` 调用下游，然后控制流回上游，这是更准确也更友好的中间件模型。

从下面的代码可以看到，中间件顺利执行完毕后将执行 `respond` 函数，失败后将执行 `ctx` 的 `onerror` 函数。`onFinished(res, onerror)` 这段代码是对响应处理过程中的错误监听，即 `handleResponse` 发生的错误或自定义的响应处理中发生的错误。

```js
compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')

  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1

    // 0 作为 dispatch 的参数传入，实际上是定义该 compose 返回的函数体内就先执行了第一个中间件的函数
    return dispatch(0)

    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))

      index = i
      // 从中间件栈中取出当前执行的中间件函数
      let fn = middleware[i]

      // 表示到达中间件栈的底部
      if (i === middleware.length) fn = next

      if (!fn) return Promise.resolve()

      try {
        // 这里 fn 的第二个函数，实际就是中间件的第二个入参 next，也就是 Koa 中间件中交给下个中间件执行控制权的函数
        // next => dispatch.bind(null, i+1)
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

`koa-compose` 其实是 Koa 一个中间件，这个中间件就暴露了一个方法 `compose`，使用 `compose` 方法处理时会进行一个判断：

1. 判断 `middleware` 参数必须是一个栈数组（先进后出）
2. 判断 `middleware` 数组里面的每一项确保都是函数

上面这段代码其实就是一个 **链式反向递归模型** 的实现，`i` 是从最大数开始循环的，将中间件从最后一个开始封装，每一次都是将自己的执行函数封装成 `next` 当做上一个中间件的 `next` 参数，这样当循环到第一个中间件的时候，只需要执行一次 `next()`，就能链式的递归调用所有中间件，这个就是 Koa 剥洋葱的核心代码机制。

到这里我们总结一下上面所有剥洋葱模型代码的流程，通过 `use` 传进来的中间件是一个回调函数，回调函数的参数是 `ctx` 上下文和 `next`，`next` 其实就是 **控制权的交接棒**，`next` 的作用是 **停止运行当前中间件**，将控制权交给下一个中间件，执行下一个中间件的 **next()** 之前的代码，当下一个中间件运行的代码遇到了 `next()`，又会将代码执行权交给下下个中间件，**当执行到最后一个中间件的时候，控制权发生反转**，开始回头去执行之前所有中间件中剩下未执行的代码，这整个流程有点像一个伪递归，当最终所有中间件全部执行完后，会返回一个 `Promise` 对象，因为我们的 `compose` 函数返回的是一个 `async` 的函数，`async` 函数执行完后会返回一个 `Promise`，这样我们就能将所有的中间件异步执行同步化，通过 `then` 就可以执行响应函数和错误处理函数。

### 错误捕获和处理

要实现一个基础框架，错误处理和捕获必不可少，一个健壮的框架，必须保证在发生错误的时候，能够捕获到错误和抛出的异常，并反馈出来，将错误信息发送到监控系统上进行反馈，目前我们实现的简易 Koa 框架还没有能实现这一点，我们接下加上错误处理和捕获的机制。

```js
throw new Error('oooops');
```

基于现在的框架，如果中间件代码中出现如上错误异常抛出，是捕获不到错误的，这时候我们看一下 `application.js` 中的 `callback` 函数的 `return` 返回代码，如下：

```js
return fn(ctx).then(respond);
```

可以看到，`fn` 是中间件的执行函数，每一个中间件代码都是由 `async` 包裹着的，而且中间件的执行函数 `compose` 返回的也是一个 `async` 函数，我们根据 ES7 的规范知道，`async` 返回的是一个 Promise 的对象实例，我们如果想要捕获 Promise 的错误，只需要使用 Promise 的 `catch` 方法，就可以把所有的中间件的异常全部捕获到，修改后 `callback` 的返回代码如下：

```js
return fn(ctx)
  .then(respond)
  .catch(onerror);
```

现在我们已经实现了中间件的错误异常捕获，但是我们还缺少框架层发生错误的捕获机制，我们希望我们的服务器实例能有错误事件的监听机制，通过 `on` 的监听函数就能订阅和监听框架层面上的错误，实现这个机制不难，使用 Node.js 原生 Events 模块即可，Events 模块给我们提供了事件监听 `on` 函数和事件触发 `emit` 行为函数，一个发射事件，一个负责接收事件，我们只需要将 Koa 的构造函数继承 Events 模块即可，构造后的伪代码如下：

```js
const EventEmitter = require('events');

class Application extends EventEmitter {}
```

继承了 Events 模块后，当我们创建 Koa 实例的时候，加上 `on` 监听函数，代码如下：

```js
let app = new Koa();

app.on('error', err => {
  console.log('error happends: ', err.stack);
});
```

这样我们就实现了框架层面上的错误的捕获和监听机制了。总结一下，错误处理和捕获，分中间件的错误处理捕获和框架层的错误处理捕获，中间件的错误处理用 Promise 的 `catch`，框架层面的错误处理用 Node.js 的原生模块 Events，这样我们就可以把一个服务器实例上的所有的错误异常全部捕获到了。至此，我们就完整实现了一个轻量版的 Koa 框架了。

---

**参考资料：**

- [KOA2 框架原理解析和实现](https://juejin.im/post/5be3a0a65188256ccc192a87)

使用方式

实现原理

对比：

Express 的设计是串联，设计思路超级简洁。
Koa 的某个中间件可以自行选择之后中间件的执行位置。

## koa-convert

handleRequest：

- 根据 `req` 和 `res` 创建 `context` 对象
- 执行 Koa 实例的 `handleRequest` 函数（注意区分两个 `handleRequest` 函数）；Koa 实例的 `handleRequest` 函数通过其最后一行代码，开启中间件函数的洋葱式调用

两个关键疑问：

1. koa-compose 对 middleware 做了什么
2. 如何实现洋葱式调用

运行中间件：

```js
return fnMiddleware(ctx)
  .then(handleResponse)
  .catch(onerror);
```

fnMiddleware 的实现：

```js
return function(context, next) {
  let index = -1;
  return dispatch(0);

  function dispatch(i) {
    if (i < index) return Promise.reject(new Error('next() called multiple times'));

    index = i;
    let fn = middleware[i];
    if (i === middleware.length) fn = next;
    if (!fn) return Promise.resolve();
    try {
      return Promise.resolve(
        fn(context, function next() {
          return dispatch(i + 1);
        })
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
```

---

**参考资料：**

- [可能是目前市面上比较有诚意的 Koa2 源码解读](https://zhuanlan.zhihu.com/p/34797505)
- [腾讯 IVWEB 团队：Koa2 框架原理解析和实现](https://juejin.im/post/6844903709592256525)

---
nav:
  title: 引擎
  order: 2
group:
  title: 事件机制
  order: 1
title: 异步编程
order: 2
---

# 异步编程

## 解决方案

异步编程的主要解决方案有如下三种：

- 事件发布/订阅模式
- Promise/Deferred 模式
- 流程控制库

### 事件发布/订阅模式

Node 自身提供的 `events` 模块是发布/订阅模式的简单实现，Node 中部分模块都继承于它，这个模块比前端浏览器大量 DOM 事件绑定的机制简单，不存在事件冒泡等概念。该模块具有 `addListener/on()`、`once()`、`removeListener()`、`removeAllListeners()` 和 `emit()` 等基本的事件监听模式的方法实现。

🌰 **基本示例：**

```js
// 订阅
emitter.on('event', function(message) {
  console.log(message);
});
// 发布
emitter.emit('event', 'I am message!');
```

订阅事件就是一个高阶函数的应用。事件发布/订阅模式可以实现一个事件与多个回调函数的关联，这些回调函数又称为事件侦听器。通过 `emit()` 发布事件后，消息会立即传递给当前事件的所有侦听器执行。侦听器可以很灵活地添加和删除，使得事件和具体处理逻辑之间可以很轻松地关联和解耦。

事件发布/订阅模式常常用于**解耦业务逻辑**，事件发布者无须关注订阅的侦听器如何实现业务逻辑，甚至不用关注有多少个侦听器存在，数据通过消息的方式可以很灵活地传递。有一些典型场景中，可以通过事件发布/订阅模式进行组件封装，将不变的部分封装在组件内部，将容易变化、需自定义的部分通过事件暴露给外部处理，这是一种典型的逻辑分离方式。在这种事件发布/订阅组件中，事件的设计非常重要，因为它关乎外部调用组件时是否优雅，从某种角度来说事件的设计就是组件的接口设计。

从另一个角度来看，事件侦听器模式也是一种钩子（hook）机制，利用钩子导出内部数据或状态给外部的调用者。Node 中的很多对象大多具有黑盒的特点，功能点较少，如果不通过事件钩子的形式，我们就无法获取对象在运行期间的中间值或内部状态。这种通过事件钩子的方式，可以使编程者不用关注组件是如何启动和执行的，只需关注在需要的事件点上即可。

Node 对事件发布/订阅机制做了额外的处理：

- Node 在对单个事件绑定超过 10 个侦听器时会抛出可能内存泄漏的警告，通过 `emitter.setMaxListeners(0)` 可将限制去除。
- 运行时错误触发 `error` 事件，EventEmitter 会检查是否有对 `error` 事件添加过侦听器。如果添加了，这个错误将会交由该侦听器处理，否则这个错误将会作为异常抛出。如果外部没有捕获这个异常，将会引起线程推出。

#### 继承 events 模块

🌰 **基本示例：Stream 对象继承 EventEmitter**

```js
const events = require('events');

function Stream() {
  events.EventEmitter.call(this);
}

util.inherits(Stream, events.EventEmitter);
```

#### 利用事件队列解决雪崩问题

在事件订阅/发布模式中，通常也有一个 `once()` 方法，通过它添加的侦听器只能执行一次，在执行之后就会将它与事件的关联移除。这个特性常常可以帮助我们过滤一些重复性的事件响应。

在计算机中，缓存由于存放在内存中，访问速度十分快，常常用于加速数据访问，让绝大多数的请求不必重复去做一些低效的数据读取。所谓雪崩问题，就是在高访问量、大并发量的情况下缓存失效的情景，此时大量的请求同时涌入数据库中，数据无法同时承受如此大的查询请求，进而往前影响到网站整体的响应速度。

🌰 **基本示例：数据库查询语句**

```js
var select = function(callback) {
  db.select('SQL', function(results) {
    callback(results);
  });
};
```

如果站点刚好启动，这时缓存中是不存在数据的，而如果访问量巨大，同一句 SQL 会被发送到数据库中反复查询，会影响服务的整体性能。

改进方案可以通过添加一个状态锁解决：

```js
var status = 'ready';

var select = function(callback) {
  if (status === 'ready') {
    status = 'pending';
    db.select('SQL', function(result) {
      status = 'ready';
      callback(results);
    });
  }
};
```

这种情景下，连续多次调用 `select()` 时，只有首次调用是生效的，后续的 `select()` 是没有数据服务的，这个时候可以引入事件队列。

```js
var proxy = new events.EventEmitter();
var status = 'ready';

var select = function(callback) {
  proxy.once('selected', callback);
  if (status === 'ready') {
    status = 'pending';
    db.select('SQL', function(results) {
      proxy.emit('selected', results);
      status = 'ready';
    });
  }
};
```

这里我们利用了 `once()` 方法，将所有请求的回调都压入事件队列中，利用其执行一次就会将监视器移除的特点，保证每个回调都只会被执行一次。对于相同的 SQL 语句，保证在同一个查询开始到结束的过程中永远只有一次。SQL 在进行查询时，新到来的相同调用只需在队列中等待数据就绪即可，一旦查询结束，得到的结果可以被这些调用共同使用。这种方式能节省重复的数据库调用产生的开销。由于 Node 单线程执行的原因，此处无须担心状态同步问题。这种方式其实也可以应用到其它远程调用的场景中，即使外部没有缓存策略，也能有效节省重复开销。

#### 多异步之间的协作方案

利用高阶函数的优势，侦听器作为回调函数可以随意添加和删除，它帮助开发者轻松处理随时可能添加的业务逻辑。也可以隔离业务逻辑，保持业务逻辑单元的职责单一。一般而言，事件与侦听器的关系是一对多，但在异步编程中，也会出现事件与侦听器的关系是多对一的情况，也就是说一个业务逻辑可能依赖两个通过回调或事件传递的结果。

### Promise/Deferred 模式

### 流程控制库

#### 尾触发与 Next

每个中间件传递请求对象、响应对象和尾触发函数，通过队列形成一个处理流。

中间件机制使得在处理网络请求时，可以像面向切面编程一样进行过滤、验证、日志等功能，而不与具体业务逻辑产生关联，以致产生耦合。

## 异步并发控制

同步 I/O 因为每个 I/O 都是彼此阻塞的，在循环体中，总是一个接着一个调用，不会出现耗用文件描述符太多的情况，同时性能也是地下的。

对于异步 I/O，虽然并发容易实现，但是由于太容易实现，依然需要控制。换言之，尽管是要压榨底层系统的性能，但还是需要给予一定的过载保护，以防止过犹不及。

### bagpipe 解决方案

- 通过队列来控制并发量
- 如果当前活跃（指调用发起但未执行回调）的异步调用量小于限定值，从队列中取出执行
- 如果活跃调用达到限定值，调用暂时存放在队列中
- 每个异步调用结束时，从队列中取出新的异步调用执行

bagpipe 的 API 主要暴露了一个 `push()` 方法和 `full` 事件。

🌰 **标准示例：**

```js
var Bagpipe = require('bagpipe');

// 设定最大并发数为10
var bagpipe = new Bagpipe(10);
for (var i = 0; i < 100; i++) {
  bagpipe.push(async, function() {
    // 异步回调执行
  });
}
bagpipe.on('full', function(length) {
  console.warn('底层系统处理不能及时完成，队列拥堵，目前队列长度为：' + length);
});
```

实现细节类似于前文的 `smooth()`。`push()` 方法依然是通过函数变换的方式实现，假设第一个参数是方法，最后一个参数是回调函数，其余为其它参数，其核心实现如下：

```js
/**
 * 推入方法，参数。最后一个参数为回调函数
 * @param {Function} method 异步方法
 * @param {Mix} args 参数列表，最后一个参数为回调函数
 */
Bagpine.prototype.push = function(method) {
  var args = [].slice.call(arguments, 1);
  var callback = args[args.length - 1];
  if (typeof callback !== 'function') {
    args.push(function() {});
  }
  if (this.options.disabled || this.limit < 1) {
    method.apply(null, args);
    return this;
  }

  // 队列长度不超过限制值时
  if (this.queue.length < this.queueLength || !this.options.refuse) {
    this.queue.push({
      method: method,
      args: args,
    });
  } else {
    var err = new Error('Too much async call in queue');
    err.name = 'TooMuchAstncCallError';
    callback(err);
  }

  if (this.queue.length > 1) {
    this.emit('full', this.queue.length);
  }

  this.next();
  return this;
};
```

将调用推入队列后，调用一次 `next()` 方法尝试触发。`next()` 方法的定义如下：

```js
/**
 * 继续执行队列中的后续动作
 */
 Bagpepe.prototype.next = function () {
   var that = this;
   if (that.active < that limit && that.queue.length) {
     var req = that.queue.shift();
     that.run(req.method, req.args);
   }
 };
```

`next()` 方法主要判断活跃调用的数量，如果正常，将调用内部方法 `run()` 来执行真正的调用。这里为了判断回调函数是否执行，采用了一个注入代码的技巧。

```js
/*!
 * 执行队列中的方法
 */
Bagpipe.prototype.run = function(method, args) {
  var that = this;
  that.active++;
  var callback = args[args.length - 1];
  var timer = null;
  var called = false;

  // inject logic
  args[args.length - 1] = function(err) {
    // anyway, clear the timer
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    // if timeout, don't execute
    if (!called) {
      that._next();
      callback.apply(null, arguments);
    } else {
      // pass the outdated error
      if (err) {
        that.emit('outdated', err);
      }
    }
  };

  var timeout = that.options.timeout;
  if (timeout) {
    timer = setTimer(function() {
      // set called as true
      called = true;
      that._next();
      // pass the exception
      var err = new Error(timeout + 'ms timeout');
      err.name = 'BgapipeTimeoutError';
      err.data = {
        name: method.name,
        method: method.toString(),
        args: args.slice(0, -1),
      };
      callback(err);
    }, timeout);
  }

  method.apply(null, args);
};
```

用户传入的回调函数被真正执行前，被封装替换过。这个封装的回调函数内部的逻辑将活跃值的计数器减 1 后，主动调用 `next()` 执行后续等待的异步调用。

bagpipe 类似于打开了一道窗口，允许异步调用并行进行，但是严格限定上线。仅仅在调用 `push()` 时分开传递，并不对原有 API 有任何侵入。

#### 拒绝模式

事实上，bagpipe 还有一些深度的使用方式。对于大量的异步调用，也需要分场景进行区分，因为设计并发控制，必然会造成部分调用需要进行等待。如果调用有实时方面的需求，那么需要快速返回，因为等到方法被真正执行时，可能已经超过了等待时间，即使返回了数据，也没有意义了。这种场景下需要快速失败，让调用方尽早返回，而不用浪费不必要的等待时间。bagpipe 为此支持了拒绝模式。

拒绝模式的使用只要设置下参数即可，相关代码如下：

```js
// 设定最大并发数为 10
var bagpipe = new Bagpipe(10, {
  refuse: true,
});
```

在拒绝模式下，如果等待的调用队列也满了之后，心来的调用就直接返回它一个队列太忙的拒绝异常。

#### 超时控制

造成队列用塞的主要原因是异步调用耗时太久，调用产生的速度远远高于执行的速度。为了防止某些异步调用使用了太多的时间，我们需要设置一个时间基线，将那些执行时间太久的异步调用清理出活跃队列，让排队中的异步调用尽快执行。否则在拒绝模式下，会有太多的调用因为某个执行得慢，导致得到拒绝异常。相对而言，这种场景下得到拒绝异常显得比较无辜。为了公平地对待在实时需求场景下的每个调用，必须要控制每个调用的执行时间，将那些害群之马提出队伍。

为此，bagpipe 也提供了超时控制。超时控制是为了异步调用设置一个时间阀值，如果异步调用没有在规定时间内完成，我们先执行用户传入的回调函数，让用户得到一个超时异常，以尽早返回。然后让下一个等待队列中的调用孩子醒。

超时的设置如下：

```js
// 设置最大并发数 10
var bagpipe = new Bagpiep(10, {
  timeout: 3000,
});
```

异步调用的并发限制在不同场景下的需求不同：非实时场景下，让超出限制的并发暂时等待执行已经可以满足需求；但在实时场景下，需要更细粒度、更合理的控制。

### async 解决方案

`async` 也提供了一个方法用于处理异步调用的限制：`parallelLimit()`。如下是 `async` 的示例代码：

```js
async.parallelLimt(
  [
    function(callback) {
      fs.readFile('file1.txt', 'utf-8', callback);
    },
    function(callback) {
      fs.readFile('file2.txt', 'utf-8', callback);
    },
  ],
  1,
  function(err, results) {
    // TODO
  }
);
```

`parallelLimit()` 与 `paralletl()` 类似，但多了一个用于限制并发数量的参数，使得任务只能同时并发一定数量，而不是无限制并发。

`parallelLimt()` 方法的缺陷在于无法动态地增加并行任务。为此，`async` 提供了 `queue()` 方法来满足该需求，这对于遍历文件目录等操作十分有效。

```js
var q = async.queue(function(file, callback) {
  fs.readFile(file, 'utf-8', callback);
}, 2);
q.drain = function() {
  // 完成了队列中的所有任务
};
fs.readdirSync('.').forEach(function(file) {
  q.push(file, function(err, data) {
    // TODO
  });
});
```

尽管 `queue()` 实现了动态添加并行任务，但是相比 `parallelLimit()` ，由于 `queue()` 接收的参数是固定的，它丢失了 `parallelLimit()` 的多样性，我私心地认为 bagpipe 更灵活，可以添加任意类型的异步任务，也可以动态添加异步任务，同时还能够在实时处理场景中加入拒绝模式的超时控制。

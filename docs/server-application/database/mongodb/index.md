---
nav:
  title: 服务端应用
  order: 5
group:
  title: MongoDB
  path: /server-framework/mongodb
  order: 40
title: MongoDB
order: 1
---

# MongoDB

在 Node.js 中使用 MongoDB 作为数据库，通常需要使用到 Mongoose 作为 xx。

https://github.com/tuzhu008/gitbook-Node_cn/blob/master/Library/mongoose/docs/API.md

## 概述

Mongoose 是 NodeJS 的驱动，不能作为其它语言的驱动。Mongoose 有两个特点：

1. 通过关系型数据库的思想来设计非关系型数据库
2. 基于 MongoDB 驱动，简化操作

Mongoose 中，有三个比较重要的概念，分别是 Schema、Model 和 Entity。它们的关系是：Schema 生成 Model，Model 创造 Document，Model 和 document 都可对数据库操作造成影响，但 Model 比 document 更具操作性。

- Schema ：一种以文件形式存储的数据库模型骨架，用于定义数据库的结构。类似创建表时的数据定义（不仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等），每个 Schema 会映射到 MongoDB 中的一个 Collection，Schema 不具备操作数据库的能力。
- Model：由 Schema 编译而成的构造器，具有抽象属性和行为，可以对数据库进行增删查改。Model 的每个实例就是一个文档 Document。
- Entity：由 Model 创建的实体，他的操作也会影响数据库

> 如果使用程序操作数据库，就要使用 MongoDB 驱动。MongoDB 驱动实际上就是应用程序提供的一个接口，不同的语言对应不同的驱动，NodeJS 驱动不能应用在其他后端语言中。

## Schema

定义文档结构和属性类型。

还能定义：

- document 的 instance methods
- model 的 static model methods
- 复合索引
- 文档的生命周期钩子，也成为中间件

通过 mongoose.Schema 来调用 Schema，然后使用 `new` 调用来创建 Schema 对象。

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mySchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, data: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});
```

⚠️ 注意：创建 Schema 对象时，声明字段类型有两种方法，一种时首字母大写的字段类型，另一种是引号包含的消协字段类型。

```js
const mySchema = new Schema({ title: String, author: String });
// or
const mySchema = new Schema({ title: 'string', author: 'string' });
```

https://www.cnblogs.com/chris-oil/p/9142795.html
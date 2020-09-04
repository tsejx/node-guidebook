# 验证 Validation

在进行数据保存时，你可以通过 validation 配置项，以防止将数据完整性破坏。

如果你要使用验证，注意几个点：

- 验证定义于 SchemaType
- 验证是一个中间件，它默认作为 `pre('save')` 钩子注册在 schema 上
- 你可以使用 `doc.validate(callback)` 或 `doc.validateSync()` 手动验证
- 验证器不对为定义的值进行验证，唯一例外是 `required` 验证器
- 验证是异步递归的。当你调用 `Model#save`，子文档验证也会执行，出错的话 `Model#save` 回调会接收错误
- 验证是可定制的

## 内置验证函数

- `required`：表示必填字段

```js
const schema = new Schema({
  name: {
    type: String,
    // 第二个参数是错误提示信息
    required: [true, 'name is required'],
  },
});
```

- `min` 和 `max`：用于 Number 类型的数据设置限制

```js
const schema = new Schema({
  eggs: {
    type: Number,
    min: [6, 'Too few eggs'],
    max: 12,
  },
});
```

- `enum`：枚举，表示属性值只能为这些
- `match`：匹配正则表达式
- `maxlength`：字符串最大长度
- `minlength`：字符串最小长度

```js
const schema = new Schema({
  drink: {
    type: String,
    enum: ['Coffe', 'Tea'],
  },
  food: {
    type: String,
    match: /^a/,
    maxlength: 12,
    minlength: 6,
  },
});
```

## 定制化验证

```js
const schema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function(data) {
        return /\d{3}-\d{3}-\d{4}/.test(data);
      },
      // VALUE 代表 phone 存放的值
      message: '{VALUE} is not a valid phone number',
    },
    required: [true, 'User phone number required'],
  },
});
```

```js
const Cat = db.model('Cat', schema);

// This cat has no name
const cat = new Cat();

cat.save(function(error) {
  assert.equal(error.errors['name'].message, 'Path `name` is required');

  error = cat.validateSync();
});
```

# Model API

* Model.init
* Model.ensureIndexes()
* Model.createIndexes()
* Model.prototype.schema
* Model.prototype.base
* Model.prototype.discriminators
* Model.translateAliases()
* Model.remove()
* Model.deleteOne()
* Model.deleteMany()
* Model.find()
* Model.findById()
* Model.findOne()
* Model.count()
* Model.distinct()
* Model.where()
* Model.prototype.$where()
* Model.findOneAndUpdate()
* Model.findByIdAndUpdate()
* Model.findOneAndRemove()
* Model.findByIdAndRemove()
* Model.create()
* Model.watch()
* Model.insertMany()
* Model.bulkWrite()
* Model.hydrate()
* Model.update()
* Model.updateMany()
* Model.updateOne()
* Model.replaceOne()
* Model.mapReduce()
* Model.aggregate()
* Model.geoSearch()
* Model.populate()

## Model.find

```js
Model.find(conditions, projection, options, callback);
```

**Params**

* conditions 筛选条件
* projection 换回的数据只包含这些字段
* options 游标操作
* callback 回调函数，返回结果后调用

## Model.findById

通过唯一 ID 查询文档，`findById(id)` 和 `findOne({ _id: id })` 几乎相同。

```js
Model.findById(id, projection, options, callback);
```

## Model.count

```js
Model.count({ type: 'jungle' }, function (err, result) {
    if (err) return handlerError(erro);

    assert(Array.isArray(result));
    console.log('unique urls with more than 100  clicks', result)
})
```

## Model.findByOne


## Model.findOneAndUpdate / Model.findByIdAndUpdate / Model.findOneAndRemove / Model.findByIdAndRemove
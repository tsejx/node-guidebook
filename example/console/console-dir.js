/**
 * console.dir(obj [, options])
 *
 * 在对象上使用 util.inspect() 并将结果字符串打印到 stdout
 * 此函数绕过了对象上定义的任何自定义 inspect 函数
 *
 * @param {any} obj
 * @param {Object} options
 * @param {boolean} options.showHidden 如果为 true，则也会显示对象的不可美剧属性和符号属性（默认值为 `false`）
 * @param {boolean} options.depth 告诉 util.inspect 格式化对象要递归多少次，这对于检查大型复杂对象很有用。要使其无限递归，可传入 null（默认值为 2）
 * @param {boolean} options.colors 如果为 true，则输出将使用 ANSI 颜色代码进行样式设置。颜色可定制，参阅 util.inspect 颜色（默认值为 `false`）
 */

console.dir({ a: 'foo', b: 'bar', c: 'baz' });
// 输出：{ a: 'foo', b: 'bar', c: 'baz' }

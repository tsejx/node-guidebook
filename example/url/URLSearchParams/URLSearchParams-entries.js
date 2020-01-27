/**
 * urlSearchParams.entries()
 * 别名：urlSearchParams[@@iterator]()
 *
 * 在查询中的每个键值对上返回一个 ES6 Iterator。 迭代器的每一项都是一个 JavaScript Array。 Array 的第一个项是键 name， Array 的第二个项是值 value。
 */

const p = new URLSearchParams({
  user: 'abc',
  age: '18',
});

console.log(p.entries());
// 输出：URLSearchParams Iterator { [ 'user', 'abc' ], [ 'age', '18' ] }

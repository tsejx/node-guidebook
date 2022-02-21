/**
 * urlSearchParams.get(name)
 *
 * 返回键是name的第一个键值对的值。如果没有对应的键值对，则返回null
 *
 * @param {name} string
 */

const p = new URLSearchParams({
  a: 'b',
  c: 'd',
});

console.log(p.get('a'));
// 输出：'b'

console.log(p.get('x'));
// 输出：null

/**
 * urlSearchParams.get(name)
 *
 * 返回键是name的第一个键值对的值。如果没有对应的键值对，则返回null
 *
 * @param {name} string
 */

const p = new URLSearchParams({
  a: 'b',
  a: 'c',
  d: 'e',
});

console.log(p.getAll('a'));
// 输出：['c']

console.log(p.getAll('x'));
// 输出：[]

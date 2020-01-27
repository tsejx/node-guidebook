/**
 * urlSearchParams.has(name)
 *
 * 如果存在至少一对键是 name 的键值对则返回 true
 *
 * @param {name} string
 */

const p = new URLSearchParams({
  a: 'b',
  c: 'd',
});

console.log(p.has('a'));
// 输出：true

console.log(p.has('x'));
// 输出：false

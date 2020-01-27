/**
 * urlSearchParams.delete(name)
 *
 * 在查询字符串中附加一个新的键值对
 *
 * @param {string} name
 */

const p = new URLSearchParams({
  user: 'abc',
  age: '18',
});

p.delete('age');

console.log(p.toString());
// 输出："user=abc"

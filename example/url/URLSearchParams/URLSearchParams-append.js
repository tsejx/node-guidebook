/**
 * urlSearchParams.append(name, value)
 *
 * 在查询字符串中附加一个新的键值对
 *
 * @param {string} name
 * @param {string} value
 */

const p = new URLSearchParams({
  user: 'abc',
});

p.append('age', '18');

console.log(p.toString());
// 输出："user=abc&age=18"

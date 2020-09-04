/**
 * urlSearchParams.values()
 *
 * 在每一个键值对上返回一个值的 ES6 Iterator
 */

const p = new URLSearchParams({
  a: 'b',
  c: 'd',
  e: 'f',
});

const values = p.values();

for (const name of values) {
  console.log(name);
}
// 输出：
// b
// d
// f

/**
 * urlSearchParams.keys(name)
 *
 * 在每个键值对上返回一个键的 ES6 Iterator
 */

const p = new URLSearchParams({
  a: 'b',
  c: 'd',
  e: 'f',
});

const keys = p.keys();

for (const name of keys) {
  console.log(name);
}
// 输出：
// a
// c
// e

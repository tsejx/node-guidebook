/**
 * urlSearchParams.set(name, value)
 *
 * 在每个键值对上返回一个键的 ES6 Iterator
 */

const p = new URLSearchParams();

p.append('a', 'b');
p.append('c', 'd');
p.append('e', 'f');

console.log(p.toString());
// 输出："a=b&c=d&e=f"

p.set('g', 'h');
p.set('i', 'j');

console.log(p.toString());
// 输出："a=b&c=d&e=f&g=h&i=j"

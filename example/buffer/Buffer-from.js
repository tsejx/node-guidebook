const foo = Buffer.from('Hello world!', 'ascii');

console.log(foo.toString('hex'));
// 输出：48656c6c6f20776f726c6421

const bar = Buffer.from('1');
// <Buffer 31>

console.log(bar[0] === 1);
// false
// 编码 1 的是个控制字符，表示 Start of Heading
console.log(String.fromCharCode(49));
// '1'
console.log(String.fromCharCode(1));
// '\u0001'
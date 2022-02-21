/**
 * new URLSearchParams(string)
 */

let params;

params = new URLSearchParams('user=abc&query=xyz');

console.log(params.get('user'));
// 輸出：abc

console.log(params.toString());
// 輸出：'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');

console.log(params.toString());
// 输出：'user=abc&query=xyz'

/**
 * new URLSearchParams(obj)
 */

params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});

console.log(params.getAll('query'));
// 输出： ['first,second']

console.log(params.toString());
// 输出：'user=abc&query=first%2Csecond'

/**
 * new URLSearchParams(iterable)
 */

// 使用数组
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);

console.log(params.toString());
// 输出：'user=abc&query=first&query=second'

// 使用 Map 对象
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');

params = new URLSearchParams(map);

console.log(params.toString());
// 输出：'user=abc&query=xyz'

// 使用 generator 函数
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}

params = new URLSearchParams(getQueryPairs());

console.log(params.toString());
// 输出：'user=abc&query=first&query=second'

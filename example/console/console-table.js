/**
 * 尝试使用 tabularData（或使用 properties）的属性和 tabularData 的行来构造一个表并记录它
 * 如果无法将其解析为表格，则回退到仅记录参数
 *
 * @param {any} tabularData
 * @param {any} properties
 */

// 这些不能解析为表格数据
console.table(Symbol());
// 输出：Symbol()

console.table(undefined);
// 輸出：undefined

console.log([
  { a: 1, b: 'X' },
  { a: 'Y', b: 2 },
]);
// 输出：
// ┌─────────┬─────┬─────┐
// │ (index) │  a  │  b  │
// ├─────────┼─────┼─────┤
// │    0    │  1  │ 'X' │
// │    1    │ 'Y' │  2  │
// └─────────┴─────┴─────┘

console.log(
  [
    { a: 1, b: 'X' },
    { a: 'Y', b: 2 },
  ],
  ['a']
);
// 輸出：
// ┌─────────┬─────┐
// │ (index) │  a  │
// ├─────────┼─────┤
// │    0    │  1  │
// │    1    │ 'Z' │
// └─────────┴─────┘

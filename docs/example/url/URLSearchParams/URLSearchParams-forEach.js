/**
 * urlSearchParams.forEach(fn [, thisArg])
 *
 * 在查询字符串中迭代每个键值对，并调用给定的函数
 *
 * @param {Function} fn 在查询字符串中的每个键值对的调用函数
 * @param {Object} thisArg 当 fn 调用时，被用作 this 值的对象
 */

const u = new URL('https://example.org/?a=b&c=d');

u.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, u.searchParams === searchParams);
});
// 输出：
// a b true
// c d true

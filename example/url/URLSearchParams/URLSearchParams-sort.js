/**
 * urlSearchParams.sort()
 *
 * 按现有名称就地排列所有的名称-值对，使用稳定排序算法完成排序，因此保留具有相同名称的名称-值对之间的相对顺序
 *
 * 该方法可以用来增加缓存命中
 */

const p = new URLSearchParams('query[]=abc&type=search&query[]=123');

p.sort();

console.log(p.toString());
// 输出：query%5B%5D=abc&query%5B%5D=123&type=search

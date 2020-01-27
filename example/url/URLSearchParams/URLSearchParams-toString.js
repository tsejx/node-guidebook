/**
 * urlSearchParams.toString()
 *
 * 返回查询参数序列化后的字符串，必要时存在百分号编码字符
 */

const p = new URLSearchParams('query[]=abc&type=search&query[]=123');

console.log(p.toString());
// 输出：query%5B%5D=abc&type=search&query%5B%5D=123

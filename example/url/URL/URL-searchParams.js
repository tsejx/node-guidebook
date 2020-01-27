/**
 * 获取表示 URL 查询参数的 URLSearchParams 对象。 该属性是只读的。 使用 url.search 设置来替换 URL 的整个查询参数
 */

const u = new URL('https://example.org?a=1&b=2&c=3');
console.log(u.searchParams);
// 输出：URLSearchParams { 'a' => '1', 'b' => '2', 'c' => '3' }

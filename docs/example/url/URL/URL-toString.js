/**
 * 在 URL 对象上调用 toString() 方法将返回序列化的 URL。 返回值与 url.href 和 url.toJSON() 的相同。
 *
 * 由于需要符合标准，此方法不允许用户自定义 URL 的序列化过程。 如果需要更大灵活性，require('url').format() 可能更合适。
 */

const u = new URL('https://example.org/foo?bar=baz');
const s = u.toString();

console.log(s);
// 输出：https://example.org/foo?bar=baz

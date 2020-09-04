/**
 * new URL(input [, base])
 *
 * @param {string} input 要解析的绝对或相对的 URL。如果 input 是相对路径，则需要 base。 如果 input 是绝对路径，则忽略 base
 * @param {string|URL} base 如果 input 不是绝对路径，则为要解析的基本 URL
 */

// 通过将 input 相对于 base 进行解析，创建一个新的 URL 对象
// 如果 base 是一个字符串，则解析方法与 new URL(base) 相同
const u1 = new URL('/foo', 'https://example.org/');
console.log('u1:', u1);
// URL {
//     href: 'https://example.org/foo',
//     origin: 'https://example.org',
//     protocol: 'https:',
//     username: '',
//     password: '',
//     host: 'example.org',
//     hostname: 'example.org',
//     port: '',
//     pathname: '/foo',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

// 如果 input 或 base 是无效的 URL，则将会抛出 TypeError
// 注意：给定值将会被强制转换为字符串
const u2 = new URL({ toString: () => 'https://example.org/' });
console.log('u2:', u2);
// URL {
//     href: 'https://example.org/',
//     origin: 'https://example.org',
//     protocol: 'https:',
//     username: '',
//     password: '',
//     host: 'example.org',
//     hostname: 'example.org',
//     port: '',
//     pathname: '/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

// 存在于 input 主机名中的 Unicode 字符将被使用 Punycode 算法自动转换为 ASCII
const u3 = new URL('https://测试');
console.log('u3:', u3);
// URL {
//     href: 'https://xn--0zwm56d/',
//     origin: 'https://xn--0zwm56d',
//     protocol: 'https:',
//     username: '',
//     password: '',
//     host: 'xn--0zwm56d',
//     hostname: 'xn--0zwm56d',
//     port: '',
//     pathname: '/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

// 只有在启用 ICU 的情况下编译 node 可执行文件时，此功能才可用，如果没有，则域名将保持不变
// 如果 input 是绝对的 URL 并且提供了 base，则事先不知道它，建议验证 URL 对象的 origin 是否是预期的
const u4 = new URL('http://Example.com/', 'https://example.org/');
console.log('u4:', u4);
// URL {
//     href: 'http://example.com/',
//     origin: 'http://example.com',
//     protocol: 'http:',
//     username: '',
//     password: '',
//     host: 'example.com',
//     hostname: 'example.com',
//     port: '',
//     pathname: '/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

const u5 = new URL('https://Example.com/', 'https://example.org/');
console.log('u5:', u5);
// URL {
//     href: 'https://example.com/',
//     origin: 'https://example.com',
//     protocol: 'https:',
//     username: '',
//     password: '',
//     host: 'example.com',
//     hostname: 'example.com',
//     port: '',
//     pathname: '/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

const u6 = new URL('foo://Example.com/', 'https://example.org/');
console.log('u6:', u6);
// URL {
//     href: 'foo://Example.com/',
//     origin: 'null',
//     protocol: 'foo:',
//     username: '',
//     password: '',
//     host: 'Example.com',
//     hostname: 'Example.com',
//     port: '',
//     pathname: '/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

const u7 = new URL('http:Example.com/', 'https://example.org/');
console.log('u7:', u7);
// URL {
//     href: 'http://example.com/',
//     origin: 'http://example.com',
//     protocol: 'http:',
//     username: '',
//     password: '',
//     host: 'example.com',
//     hostname: 'example.com',
//     port: '',
//     pathname: '/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

const u8 = new URL('https:Example.com/', 'https://example.org/');
console.log('u8:', u8);
// URL {
//     href: 'https://example.org/Example.com/',
//     origin: 'https://example.org',
//     protocol: 'https:',
//     username: '',
//     password: '',
//     host: 'example.org',
//     hostname: 'example.org',
//     port: '',
//     pathname: '/Example.com/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

const u9 = new URL('foo:Example.com/', 'https://example.org/');
console.log('u9:', u9);
// URL {
//     href: 'foo:Example.com/',
//     origin: 'null',
//     protocol: 'foo:',
//     username: '',
//     password: '',
//     host: '',
//     hostname: '',
//     port: '',
//     pathname: 'Example.com/',
//     search: '',
//     searchParams: URLSearchParams {},
//     hash: ''
// }

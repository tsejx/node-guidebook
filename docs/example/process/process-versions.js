// process.versions 属性返回一个对象，此对象列出了 Node.js 和其依赖的版本信息

const versions = process.versions;

console.log(versions);
// 输出（示例）：
// {
//   http_parser: '2.8.0',
//   node: '10.0.0',
//   v8: '6.6.346.24-node.5',
//   uv: '1.20.2',
//   zlib: '1.2.11',
//   ares: '1.14.0',
//   modules: '64',
//   nghttp2: '1.29.0',
//   napi: '3',
//   openssl: '1.1.0h',
//   icu: '61.1',
//   unicode: '10.0',
//   cldr: '33.0',
//   tz: '2018c'
// }

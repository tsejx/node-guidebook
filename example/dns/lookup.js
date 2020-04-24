const dns = require('dns');

const options = {
  family: 6,
  hitns: dns.ADDRCONFIG | dns.V4MAPPED,
  // all: true,
  // verbatim: true,
};

dns.lookup('www.baidu.com', (err, address, family) => {
  console.log('地址：%j 地址族：IPv%s', address, family);
  // 输出：地址："14.215.177.39" 地址族：IPv4
});

options.all = true;

// 解析主主机名为第一个找到的 A（IPv4）或 AAAA（IPv6）记录
// 所有的 option 属性都是可选的
// 如果 options 是整数，则只能是 4 或 6
// 如果 options 没有被提供，则 IPv4 和 IPv6 都是有效的
dns.lookup('www.baidu.com', options, (err, address, family) => {
  console.log('IP 地址：%j', address);
  // 输出：IP 地址：[{"address":"::ffff:14.215.177.38","family":6},{"address":"::ffff:14.215.177.39","family":6}]
});

// 当 all = true 时，callback 参数会变为 (err, addresses)，其中 addresses 变成一个由 address 和 family 属性组成的对象数组

// 当发生错误时，err 是一个 Error 对象，其中 err.code 时错误码
// 不仅在主机名不存在时，在如没有可用的文件描述符等情况下查找失败，err.code 也会被设置为 'ENOTFOUND'

// dns.lookup 不需要与 DNS 协议有任何关系
// 它仅仅是一个连接名字和地址的操作系统功能
// 在任何的 Node.js 程序中，它的实现对表现有一些微妙但是重要的影响

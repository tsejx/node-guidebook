const dns = require('dns');

dns.resolve4('www.taobao.com', (err, addresses) => {
  if (err) throw err;

  console.log(`IP 地址: ${JSON.stringify(addresses)}`);
  // 输出：IP 地址: ["113.96.109.101","113.96.109.100"]
});

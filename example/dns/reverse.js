const dns = require('dns');

dns.resolve('113.96.109.101', (err, hostnames) => {
    console.log(hostnames);
})
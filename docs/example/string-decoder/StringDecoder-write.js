const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

const str = decoder.write(Buffer.from([0xe4, 0xbd, 0xa0]));
console.log(str);
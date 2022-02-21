/**
 * querystring.unescape(str)
 *
 * @param {string} str
 */
const querystring = require('querystring');

const url = "key%3DIt's%20the%20final%20countdown";
const qs = querystring.unescape(url);

console.log(qs);
// 输出：key=It's the final countdown

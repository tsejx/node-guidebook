/**
 * querystring.escape(str)
 *
 * @param {string} str
 */

const querystring = require('querystring');

const url = "key=It's the final countdown";
const qs = querystring.escape(url);

console.log(qs);
// 输出：key%3DIt's%20the%20final%20countdown
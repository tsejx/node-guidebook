const buff1 = Buffer.alloc(10);
const buff2 = Buffer.alloc(20);

const totalLength = buff1.length + buff2.length;

console.log(totalLength);
// 输出：30

const buff3 = Buffer.concat([buff1, buff2], totalLength);

console.log(buff3.length);
// 输出：30

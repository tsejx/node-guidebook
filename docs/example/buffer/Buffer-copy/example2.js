// 创建一个 `Buffer`，并拷贝同一 `Buffer` 中一个区域的数据到另一个重叠的区域

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// 输出：efghijghijklmnopqrstuvwxyz

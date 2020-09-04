// 为其编译 Node.js 二进制文件的操作系统的 CPU 架构
const arch = process.arch;

console.log(arch);

// 可能值
// 1. arm
// 2. arm64
// 3. ia32
// 4. mips
// 5. mipsel
// 6. ppc
// 7. ppc64
// 8. s390
// 9. s390x
// 10. x32
// 11. x64
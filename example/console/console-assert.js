/**
 * console.assert(value [, ...message])
 *
 * 简单的断言测试，用于验证 value 是否为真
 * 如果不是，则记录 Assertion failed
 * 如果提供 message 则通过传入所有消息参数来使用 util.format() 格式化错误消息
 *
 * @param {any} value
 * @param {any} ...message
 */

console.assert(true, '什么也不做');
// 输出：(不输出东西)

console.assert(false, '%s 工作', '无法');
// 输出：Assertion failed：无法 工作

// 使用非真的断言调用 console.assert 只会导致打印 message 到控制台而不会中断后续代码的执行

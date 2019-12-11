// NODE_OPTIONS 环境变量中允许的特殊只读标志的 Set
const flags = process.allowedNodeEnvironmentFlags;

console.log(flags);

// 该方法扩展了 Set，但重写了 Set.prototype.has 以识别几种不同的可能标志的表示
// 在以下情况下，调用 has 方法将会返回 true
// * 标志可以省略前导单（-）或双（--）破折号。例如， inspect-brk 用于 --inspect-brk，或 r 用于 -r。
// * 传给 V8 的标志（如 --v8-options 中所列）可以替换下划线的一个或多个非前导短划线，反之亦然。例如， --perf_basic_prof、 --perf-basic-prof、 --perf_basic-prof 等。
// * 标志可以包含一个或多个等号（=）字符。包含第一个等号后的所有字符都将被忽略。例如， --stack-trace-limit=100。
// * 在 NODE_OPTIONS 中必须允许标志。



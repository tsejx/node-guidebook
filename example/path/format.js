const path = require('path');

// path.format(pathObject)
// * dir 文件夹路径
// * root 根路径
// * base 当前文件名
// * name
// * ext

// 从对象返回路径字符串
// 注意以下组合，其中一些属性优先于另一些属性：
// * 如果提供了 dir，则忽略 root
// * 如果 base 存在，则忽略 ext 和 name

// 如果提供 dir、root 和 base
// 则返回 `${dir}${path.sep}${base}`
// `root` 会被忽略
const path1 = path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.text',
});
console.log(path1);
// 输出：`/home/user/dir/file.txt`

// 如果未指定 dir，则指定 root
// 如果只提供 root，或 dir 等于 root，则将不包括平台分隔符
// ext 将被忽略
const path2 = path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
console.log(path2);
// 输出： `/file.txt`

// 如果未指定 base，则使用 `name` + `ext`
const path3 = path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
console.log(path3);
// 输出：`/file.txt`
const path = require('path');

// path.format 的反向操作

const parsePath = path.parse('/home/user/dir/index.html');
console.log(parsePath);
// 输出:
// {
//     root: '/',
//     dir: '/home/user/dur',
//     base: 'index.html',
//     ext: '.html',
//     name: 'index'
// }

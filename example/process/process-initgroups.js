// process.initgroups() 方法读取 /etc/group 文件，并且初始化组访问列表，该列表包括了用户所在的所有组

// 该方法需要 Node.js 进程有 root 访问或者有CAP_SETGID 能力才能操作

// 删除权限时要小心：

console.log(process.getgroups());
// 输出（示例）：[ 20, 501, 12, 61, 79, 80, 81, 98, 702, 703, 704, 701, 705, 33, 100, 204 ]

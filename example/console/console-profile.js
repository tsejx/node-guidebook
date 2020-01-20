/**
 * （仅用于与检查器（`--inspect` 标志）一起使用，否则此方法不显示任何内容）
 * 该方法启动带有可选标签的 JavaScript CPU 配置文件，直到调用 console.profileEnd
 * 然后将配置文件添加到检查器的 Profiles 面板中
 *
 * @param {any} label
 */

console.profile('Label');

console.profileEnd('Label');

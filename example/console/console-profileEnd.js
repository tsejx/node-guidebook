/**
 * （仅用于与检查器（`--inspect` 标志）一起使用，否则此方法不显示任何内容）
 * 如果已启动，则停止当前的 JavaScript CPU 概要分析会话，并将报告打印到检查器的 Profiles 面板。
 * 如果在没有标签的情况下调用此方法，则会停止最近启动的配置文件。
 *
 * @param {any} label
 */

console.profile('Label');

console.profileEnd('Label');

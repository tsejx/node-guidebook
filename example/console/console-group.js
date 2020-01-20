/**
 * 对打印信息进行分组，与 console.groupEnd 相辅相成
 * 如果提供一个或多个 label，则首先打印它们，而不另外添加缩进
 * 将后续行的缩进增加两个空格
 *
 * 别名：console.groupCollapsed
 *
 * @param {any} label
 */

function execute() {
  console.group('execute');

  foo();

  bar();

  baz();

  console.groupEnd();
}

function foo() {
  console.group('foo');

  console.log('Function foo start!');

  console.groupEnd('foo');
}

function bar() {
  console.group('bar');

  console.log('Function bar start!');

  console.groupEnd('bar');
}

function baz() {
  console.group('baz');

  console.log('Function baz start!');

  console.groupEnd('baz');
}

execute();
// 输出：
// execute
//  foo
//    Function foo start!
//  bar
//    Function bar start!
//  baz
//    Function baz start!

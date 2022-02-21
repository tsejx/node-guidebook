/**
 * 对打印信息进行分组，与 console.group 相辅相成
 * 减少后续行的缩进两个空格
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

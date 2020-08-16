---
title: JS基础
date: 2020-08-12 00:55:50
tags:
---
# JS基础
## 变量提升
现象：所有的变量的声明会被提升到代码的开头，这就叫做变量提升(hoisting)。
原理：JavaScript引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。
## 闭包
### 概念
MDN解释：闭包是函数和声明该函数的词法环境的组合。
简单理解：闭包 = 函数 + 函数内可访问的变量总和

### 闭包的作用
闭包最⼤的作⽤就是隐藏变量，闭包的⼀⼤特性就是内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回（寿命终结）了之后。

基于此特性。JS可以实现私有变量，特权变量，储存变量。

## JS的作用域链
JavaScript属于静态作⽤域，即声明的作⽤域是根据程序正⽂在编译时就确定的，有时也称为词法作⽤域。

其本质是JavaScript在执⾏过程中会创造可执⾏上下⽂，可执⾏上下⽂中的词法环境中含有外部词法环境的引⽤，我们 可以通过这个引⽤获取外部词法环境的变量、声明等，这些引⽤串联起来⼀直指向全局的词法环境，因此形成了作⽤域链。

## ES6 模块和CommonJS模块
区别：
1. CommonJS是对模块的浅拷⻉，ES6 Module是对模块的引⽤,即ES6	Module只存只读，不能改变其值，具体点就是指针指向不能变，类似const 。

2. import的接⼝是read-only（只读状态），不能修改其变量值。	即不能修改其变量的指针指向，但可以改变变量内部 指针指向,可以对commonJS对重新赋值（改变指针指向），但是对ES6 Module赋值会编译报错。

共同点：CommonJS和ES6 Module都可以对引⼊的对象进⾏赋值，即对对象内部属性的值进⾏改变。

## JS有哪些数据类型？
原始类型，引用类型。
原始类型： null, undefined, boolean, number, string, symbol。
引用类型： Object。
### null与undefined区别
null表示空，代表此处没有值。typeof null 为 object。
undefined表示不存在，代表值为空值或者根本不存在。因为存不存在只在运行期才直到，这就是undefined的意义所在。
## 0.1+0.2 为什么不等于0.3
JS number类型 使用IEEE 754标准，使用的是64位固定长度来表示。
1. 在0.1转换为二进制表示
2. 再将二进制通过科学计数法表示
3. 将通过科学计数法表示的二进制转换为IEEE 754标准表示时，发现值已经变了，从而导致计算精度出现问题。
并不只是JS有这个问题，使用IEEE 754标准表示浮点数都有这个问题。
## JS类型转换的规则有哪些？
if语句，逻辑语句，数学逻辑运算符， == 等情况下都会出现 隐式类型转化。
类型只会转换为数字，布尔和字符串三种类型。
为false的情况：null, undefined, 0, NAN, "", false,除此之外全为true。

js内部引用类型转换成原始类型会调用ToPrimitive方法
## JS原型链
### 原型对象
每一个构造函数都有一个属性prototype叫做原型对象，原型对象上的属性和方法为该构造函数创建的实例所共用。
### 原型链
每个实例都有__proto__属性，此属性指向该对象的构造函数的原型。
实例对象通过__proto__找到上游的构造函数的原型对象，上游的原型对象也有__proto__属性，这样就形成了原型链。
原型链的顶层是Object，Object的__proto__属性指向null。
实例的constructor 属性返回该实例对象的构造函数。
## 判断是否是数组
ES6:
```js
Array.isArray(value)
```
非ES6:
```js
if (Object.prototype.toString.call(value) === '[object Array]') {
    // code block
}
```
## this
默认情况下，this指向全局对象，比如在浏览器就是指向window。
this的指向问题总结一句话就是谁调用指向谁。
```js
// obj中调用方法
function foo() {
    console.log(this.name)
}
var obj = {
    name: "coke"，
    foo: foo
}
obj.foo() // this指向obj

// 构造函数中
function Foo(name) {
    this.name = name // this指向实例对象
}
const coke = new Foo('coke')

```
改变this指向的常见方法：call，apply，bind。
call 接受一个个参数，apply接受一个参数数组，bind返回一个新函数。

## 箭头函数的this指向哪里
箭头函数不同于传统JavaScript中的函数，箭头函数并没有属于⾃⼰的this,它的所谓的this是捕获其所在上下⽂的	this 值，作为⾃⼰的	this值,并且由于没有属于⾃⼰的this,⽽箭头函数是不会被new调⽤的，这个所谓的this也不会被改变.

## async/await
async函数，就是	Generator函数的语法糖，它建⽴在Promise上，并且与所有现有的基于Promise的API兼容。
1. async 声明一个异步函数
2. 自动件常规函数转换成Promise，返回值也是Promise对象。
3. 只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。
4. await必须在async声明的函数内部使用。
5. await强制代码等待，直到异步操作完成并返回结果。
6. await只能和Promise一起使用，不适用于回调。
7. await 不适合用于forEach,map,filter,reduce，可以在for循环中使用或者没有回调的循环。

## async/await相比于Promise的优势
1. 更像同步代码，Promise的then的调用有额外的阅读负担
2. Promise 传递中间值非常麻烦，而async/await写法类似同步代码。
3. 错误处理友好，async/await可以用成熟的try/catch，Promise的错误捕获非常冗余。
4. Promise不好调试，步进功能无法进入then。

## JS参数传递方式
基本类型数据按值传递
引用类型按共享传递
```js
// 1.
var obj = {
    a: 1,
    b: 2
}
function test(x) {
    x.a = 10
    console.log(x)
}
test(obj) // {a:10,b:2}
console.log(obj) // {a:10,b:2}
// 2.
var obj = {
    a: 1,
    b: 2
}
function test(x) {
    x = 10
    console.log(x)
}
test(obj) // 10
console.log(obj) // {a:1,b:2}
```
出现上述代码中的情况是因为传递参数的时候，会生成一个副本obj，这个副本指向了参数x的内存地址。当给这个副本变量整个重新赋值的时候，引用的指向就改变了。当改变这个副本变量下的属性的值的时候，就会去操作引用指向的内存中的值，同时外部变量obj的值也会受到影响，因为它们属于同一的内存地址下的数据。

## JS 实现不可变对象
1.	深克隆，但是深克隆的性能⾮常差，不适合⼤规模使⽤ 
2.	Immutable.js，Immutable.js是⾃成⼀体的⼀套数据结构，性能良好，但是需要学习额外的API 
3.	immer，利⽤Proxy特性，⽆需学习额外的api，性能良好

## JS的基本类型和复杂类型是存储在哪里？
基本类型存储在栈中，但是一旦被闭包引用则成为常住内存，会存储在内存堆中。
复杂类型会存储在内存堆中。
## JS垃圾回收机制


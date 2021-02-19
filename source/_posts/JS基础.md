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
undefined表示不存在，代表值为空值或者根本不存在。因为存不存在只在运行期才知道，这就是undefined的意义所在。
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
2. 自动将常规函数转换成Promise，返回值也是Promise对象。
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

## JS 高级技巧

### 惰性载入函数
为了解决函数中的if else语句不是每次都是必须执行，为了避免执行不必要的代码。惰性载入表示函数执行的分支仅会发生一次，优点就是只在执行代码分支时牺牲一点性能。

1. 函数被调用时再次处理函数每次重写原函数，最后将原函数的执行结果返回，下一次调用的时候，就会直接调用被分配的函数，这样就不用再次执行if语句。
```js
function createXHR() {
    if () {
        createXHR = function () {

        }
    } else if () {
        createXHR = function() {

        }
    } else {
        createXHR = function () {}
    }
    return createXHR();
}
```
2. 实现惰性载入的方式就是在声明函数时就指定适当的函数。这样第一次调用函数时就不会损失性能，而在代码首次加载时会损失一点性能。
这种方式是创建一个匿名，自执行的函数，用来确定应该使用哪一个函数实现。
```js
const createXHR = (function () {
    if () {
        return function () {}
    } else if () {
        return function () {}
    } else {
        return function () {}
    }
})();
```

### 函数绑定
函数绑定要创建一个函数，可以在特定的this环境中以指定参数调用另一个函数。常常和回调函数和事件处理程序一起使用，以便将函数作为变量传递的同时保留代码执行环境。

只要是将函数以值得形式进行传递，并且该函数必须在特定得环境中执行，就需要使用到函数绑定得技巧。主要用于事件处理程序以及setTimeout和setInterval。缺点比普通函数需要更多得内存，并且多重函数得调用也慢一点。

1. 实现将函数绑定到指定环境的函数，bind()
bind()函数返回一个在给定环境中调用给定函数的函数。
ECMAScript5 原生实现了bind方法，这个方法可以直接在函数上调用。
```js
function bind(fn, context) {
    return function () {
        return fn.apply(context, arguments)
    }
}

// 原生bind, 执行的结果返回一个函数。
fn.bind(context)
```
### 函数柯里化（function currying）
函数柯里化与函数绑定紧密相关，函数柯里化得基本方法和函数绑定一样: 使用一个闭包返回一个函数。两者的区别在于，当函数被调用时，返回的函数还需要设置一些传入的参数。
```js
function add (num1, num2) {
    return num1+num2;
}
function curryingAdd(num1) {
    return function(num2) {
        return num1 + num2;
    }
}

curryingAdd(2)(3);
```

创建柯里化函数的通用方式
```js
function add(num1, num2) {
    return num1 + num2;
}
function curry(fn) {
    const args = Array.prototype.slice.call(arguments, 1);
    return function () {
        const innerArgs = Array.prototype.slice.call(arguments);
        const finalArgs = args.concat(innerArgs);
        return fn.apply(null, finalArgs);
    }
}
const curriedAdd = curry(add, 5);
curriedAdd(3);
```
函数柯里化作为函数绑定的一部分,构造出更为复杂的bind函数。
```js
function bind(fn, context) {
    const innerArgs = Array.prototype.slice.call(arguments, 2);
    return function () {
        const innerArgs = Array.prototype.slice.call(arguments);
        const finalArgs = args.concat(innerArgs);
        return fn.apply(context, finalArgs);
    }
}
// 使用bind函数
bind(fn, context, args1)(args2)
```
ECMAScript5 的bind方法也是先函数柯里化，只要在this的值之后再传入另一个参数即可。
```js
fn.bind(obj, 'xxx')();
```
javaScript中的柯里化函数和绑定函数都提供了强大的动态函数创建功能。使用bind()还是curry()要根据是否需要object对象响应来决定。两者都不能滥用，每个函数都会带来额外的开销。

### 防篡改对象
任何对象都可以被在同意环境中运行的代码修改，通常开发JavaScript库的时候会需要定义防篡改对象。

一旦把对象定义为防篡改就无法撤销了。

1. 不可扩展对象
Object.preventExtension()不能再给对象添加属性和方法。
```js
const person = {name: 'coke'}
Object.preventExtension(person)

// 判断对象是否可以扩展
Object.isExtensible(person)
```
2. 密封的对象
Object.seal()方法封闭一个对象，阻止添加或者删除属性，并将所有现有属性标记为不可配置，即将Configurable特性设置为false。当前属性的值只要原来是可写的就可以改变。
```js
const person = {name: 'coke'}
Object.seal(person);

// 判断对象是否密封
Object.isSealed(person)
```

3. 冻结的对象
最严格的防篡改级别是冻结对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。而且对象的属性的Writable特性会被设置为false。

如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。所以freeze只是浅冻结，要使对象不可变，需要递归冻结每个类型为对象的属性（深冻结）。

冻结JavaScript库的主要对象能够防止意外修改了库中的核心对象。
```js
const person = {name: 'coke'}
Object.freeze(person)

// 判断对象是否冻结
Object.isFrozen(person)

// 深冻结函数
function deepFreeze(obj) {

  // 取回定义在obj上的属性名
  var propNames = Object.getOwnPropertyNames(obj);

  // 在冻结自身之前冻结属性
  propNames.forEach(function(name) {
    var prop = obj[name];

    // 如果prop是个对象，冻结它
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // 冻结自身(no-op if already frozen)
  return Object.freeze(obj);
}

obj2 = {
  internal: {}
};

deepFreeze(obj2);
obj2.internal.a = 'anotherValue';
obj2.internal.a; // undefined
```

### 高级定时器
定时器是计划代码在未来的某个时间执行，但是执行时机是不能保证的，因为在页面的生命周期中，不同的时间可能有其他代码在控制JavaScript进程。在页面下载完后的代码运行，事件处理程序，Ajax回调函数都必须使用同样的线程来执行。
实际上，浏览器负责进行排序，指派某段代码在某个时间点运行的优先级。

### JavaSCript运行机制
JavaScript运行 主要包括JavaScript执行进程和任务队列，执行进程用于执行代码，任务队列用于接收需要放入执行进程执行的任务代码。
在JavaScript中没有任何代码是立刻执行的，但一旦执行进程空闲则尽快执行。
#### setTimeout 定时器
定时器对队列的工作方式是，当特定时间过去后将代码插入。给任务队列添加代码并不意味着对它立刻执行。设定一个150ms后执行的定时器不代表到了150ms代码就立刻执行，它表示代码会在150ms后会被加入到任务队列中。如果在这个时间点上，队列中没有其他东西，那么这段代码就会被执行。其他情况下，代码可能等待更长时间才执行。

定时器最重要的事情是，指定的时间间隔表示何时将定时器的代码添加到队列，而不是何时实际执行代码。

### setInterval 重复的定时器
setInterval创建的定时器确保了定时器代码规则地插入到任务队列。但存在地问题是定时器代码可能在代码再次添加到队列之前还没有执行完，结果导致定时器代码连续运行了多次，而之间没有任何停顿。JavaScript引擎会在当任务队列没有该定时器的任何代码实例时，才将定时器代码添加到队列。确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

这种方式处理重复的定时器也有2个问题：1.某些间隔的定时器代码会被跳过；2.多个定时器的代码执行之间的间隔可能会比预期的小。

使用链式setTimeout(), 避免setInterval()重复定时器的缺点。在前一个定时器代码执行完之前，不会像队列插入新的定时器代码，确保不会有任何缺失的间隔。而且，它保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免了连续的运行。这个模式主要用于重复定时器。
```js
setTimeout(function () {
    // handle code
    setTimeout(arguments.callee, interval)
, interval})
```
### 定时器应用-数组分割处理数据
由于JavaScript的执行是一个阻塞操作，脚本运行所花的时间越久，用户无法与页面交互的时间越久。
过长，过深的嵌套的函数调用和大量的循环处理都可能造成脚本的长时间运行。而运行在浏览器中JavaScript都被分配了一个确定数量的资源，以防止web程序导致用户的计算机宕机。

为了解决某个循环占用大量的时间，有两种思考方向：1.是否为同步，这个数据的处理是否会造成其他运行的阻塞。2.是否必须按顺序完成，如果顺序不重要，那么可以推迟处理。
如果以上两种假设都是否，就可以使用定时器分割这个循环。通过使用数组分块的技术，小块地处理数组，每次一小块。

基本思路是为要处理地项目创建一个队列，然后使用定时器取出下一个要处理地项目进行处理，接着再设置另一个定时器。

数组分块处理函数
数组分块地重要性在于它可以将多个项目地处理在执行队列上分开，在每个项目处理之后，给予其他的浏览器处理机会运行，这样避免长时间运行脚本地错误。

一旦某个函数需要花50ms以上的时间完成，那么可以考虑是否可以将任务分割为一系列可以使用定时器的小任务。
```js
function chunk (array, process, context) {
    setTimeout(function () {
        // 取出下一条数据进行处理
        const item = array.shift();
        process.call(context, item);
        // 如果还有数据，再设置另一个定时器
        if (array.length > 0) {
            setTimeout(arguments.callee, 100);
        }
    }, 100)
}
const array = [1,23,4,5,7];
const process = function (item) {};
// 使用concat克隆数组，避免改变原数组
chunk(array.concat(), process, context)
```
### 定时器应用-函数节流
浏览器中的DOM操作比起非DOM操作需要更多的内存和CPU时间。连续尝试进行过多的DOM操作可能会导致浏览器崩溃。

此时使用定时器对操作DOM 的函数进行节流。

函数节流的基本思想是指，某些代码不可以在没有间断的情况下连续重复执行。第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用该函数时，它会清除前一次的定时器，并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。目的就是只有在执行函数的请求停止了一段时间之后才执行。

```js
const processor = {
    timeoutId: null,
    // 实际进行处理的方法
    performProcessing: function () {
        // 实际执行的代码
    },
    // 初始处理调用的方法
    process: function() {
        clearTimeout(this.timeoutId);
        const that = this;
        this.timeoutId = setTimeout(function () {
            that.performProcessing();
        }, 100)
    }
}
// 开始执行
processor.process();
```
这个模式可以使用throttle()函数来简化，这个函数可以自动 进行定时器的设置和清除。
```js
function throttle( method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
        method.call(context);
    }, 100)
}

```
节流在resize事件中常用，如果给予该事件改变页面的布局，最好控制处理频率，以确保浏览器不会在极短的时间内进行过多的计算。

```js
function resizeDiv() {
    const div = document.getElementById("myDiv");
    div.style.height = div.offsetWidth + "px";
}

window.onresize = function () {
    throttle(resizeDiv);
}
```
只要代码是周期性执行的，都应该使用节流，但是你不能控制请求执行的速率。

### 自定义事件
事件是JavaScript与浏览器进行交互的主要途径。事件是一种叫做观察者的设计模式，这是一种创建松散耦合代码的技术。

观察者模式由主体和观察者组成。主体发布事件，观察者通过订阅这些事件来观察主体。该模式的关键是主体并不知道观察者的任何事情，也就是说它可以独自存在并正常运作即使观察者不存在。观察者知道主体，并能注册事件的回调函数（事件处理程序）。DOM元素便是主体，事件处理代码便是观察者。

事件是与DOM交互的最常见的方式，但它们也可以用于非DOM代码中，通过实现自定义事件。自定义事件就是创建一个管理事件的对象，让其他对象监听那些事件。
```js
function EventTarget() {
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addHandler: function () {}
}
```
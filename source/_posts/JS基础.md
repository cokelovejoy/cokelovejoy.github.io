---
title: JS基础
date: 2020-08-12 00:55:50
tags:
---

# JS 基础

## 变量提升

现象：所有的变量的声明会被提升到代码的开头，这就叫做变量提升(hoisting)。
原理：JavaScript 引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。

## 闭包

### 概念

MDN 解释：闭包是函数和声明该函数的词法环境的组合。
简单理解：闭包 = 函数 + 函数内可访问的变量总和

### 闭包的作用

闭包最⼤的作⽤就是隐藏变量，闭包的⼀⼤特性就是内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回（寿命终结）了之后。

基于此特性。JS 可以实现私有变量，特权变量，储存变量。

## JS 的作用域链

JavaScript 属于静态作⽤域，即声明的作⽤域是根据程序正⽂在编译时就确定的，有时也称为词法作⽤域。

其本质是 JavaScript 在执⾏过程中会创造可执⾏上下⽂，可执⾏上下⽂中的词法环境中含有外部词法环境的引⽤，我们 可以通过这个引⽤获取外部词法环境的变量、声明等，这些引⽤串联起来⼀直指向全局的词法环境，因此形成了作⽤域链。

## ES6 模块和 CommonJS 模块

区别：

1. CommonJS 是对模块的浅拷⻉，ES6 Module 是对模块的引⽤,即 ES6 Module 只存只读，不能改变其值，具体点就是指针指向不能变，类似 const 。

2. import 的接⼝是 read-only（只读状态），不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部 指针指向,可以对 commonJS 对重新赋值（改变指针指向），但是对 ES6 Module 赋值会编译报错。

共同点：CommonJS 和 ES6 Module 都可以对引⼊的对象进⾏赋值，即对对象内部属性的值进⾏改变。

## JS 有哪些数据类型？

原始类型，引用类型。
原始类型： null, undefined, boolean, number, string, symbol。
引用类型： Object。

### null 与 undefined 区别

null 表示空，代表此处没有值。typeof null 为 object。
undefined 表示不存在，代表值为空值或者根本不存在。因为存不存在只在运行期才知道，这就是 undefined 的意义所在。

## 0.1+0.2 为什么不等于 0.3

JS number 类型 使用 IEEE 754 标准，使用的是 64 位固定长度来表示。

1. 在 0.1 转换为二进制表示
2. 再将二进制通过科学计数法表示
3. 将通过科学计数法表示的二进制转换为 IEEE 754 标准表示时，发现值已经变了，从而导致计算精度出现问题。
   并不只是 JS 有这个问题，使用 IEEE 754 标准表示浮点数都有这个问题。

## JS 类型转换的规则有哪些？

if 语句，逻辑语句，数学逻辑运算符， == 等情况下都会出现 隐式类型转化。
类型只会转换为数字，布尔和字符串三种类型。
为 false 的情况：null, undefined, 0, NAN, "", false,除此之外全为 true。

js 内部引用类型转换成原始类型会调用 ToPrimitive 方法

## JS 原型链

### 原型对象

每一个构造函数都有一个属性 prototype 叫做原型对象，原型对象上的属性和方法为该构造函数创建的实例所共用。

### 原型链

每个实例都有**proto**属性，此属性指向该对象的构造函数的原型。
实例对象通过**proto**找到上游的构造函数的原型对象，上游的原型对象也有**proto**属性，这样就形成了原型链。
原型链的顶层是 Object，Object 的**proto**属性指向 null。
实例的 constructor 属性返回该实例对象的构造函数。

## 判断是否是数组

ES6:

```js
Array.isArray(value);
```

非 ES6:

```js
if (Object.prototype.toString.call(value) === "[object Array]") {
  // code block
}
```

## this

默认情况下，this 指向全局对象，比如在浏览器就是指向 window。
this 的指向问题总结一句话就是谁调用指向谁。

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

改变 this 指向的常见方法：call，apply，bind。
call 接受一个个参数，apply 接受一个参数数组，bind 返回一个新函数。

## 箭头函数的 this 指向哪里

箭头函数不同于传统 JavaScript 中的函数，箭头函数并没有属于⾃⼰的 this,它的所谓的 this 是捕获其所在上下⽂的 this 值，作为⾃⼰的 this 值,并且由于没有属于⾃⼰的 this,⽽箭头函数是不会被 new 调⽤的，这个所谓的 this 也不会被改变.

## async/await

async 函数，就是 Generator 函数的语法糖，它建⽴在 Promise 上，并且与所有现有的基于 Promise 的 API 兼容。

1. async 声明一个异步函数
2. 自动将常规函数转换成 Promise，返回值也是 Promise 对象。
3. 只有 async 函数内部的异步操作执行完，才会执行 then 方法指定的回调函数。
4. await 必须在 async 声明的函数内部使用。
5. await 强制代码等待，直到异步操作完成并返回结果。
6. await 只能和 Promise 一起使用，不适用于回调。
7. await 不适合用于 forEach,map,filter,reduce，可以在 for 循环中使用或者没有回调的循环。

## async/await 相比于 Promise 的优势

1. 更像同步代码，Promise 的 then 的调用有额外的阅读负担
2. Promise 传递中间值非常麻烦，而 async/await 写法类似同步代码。
3. 错误处理友好，async/await 可以用成熟的 try/catch，Promise 的错误捕获非常冗余。
4. Promise 不好调试，步进功能无法进入 then。

## JS 参数传递方式

基本类型数据按值传递
引用类型按共享传递

```js
// 1.
var obj = {
  a: 1,
  b: 2,
};
function test(x) {
  x.a = 10;
  console.log(x);
}
test(obj); // {a:10,b:2}
console.log(obj); // {a:10,b:2}
// 2.
var obj = {
  a: 1,
  b: 2,
};
function test(x) {
  x = 10;
  console.log(x);
}
test(obj); // 10
console.log(obj); // {a:1,b:2}
```

出现上述代码中的情况是因为传递参数的时候，会生成一个副本 obj，这个副本指向了参数 x 的内存地址。当给这个副本变量整个重新赋值的时候，引用的指向就改变了。当改变这个副本变量下的属性的值的时候，就会去操作引用指向的内存中的值，同时外部变量 obj 的值也会受到影响，因为它们属于同一的内存地址下的数据。

## JS 实现不可变对象

1. 深克隆，但是深克隆的性能⾮常差，不适合⼤规模使⽤
2. Immutable.js，Immutable.js 是⾃成⼀体的⼀套数据结构，性能良好，但是需要学习额外的 API
3. immer，利⽤ Proxy 特性，⽆需学习额外的 api，性能良好

## JS 的基本类型和复杂类型是存储在哪里？

基本类型存储在栈中，但是一旦被闭包引用则成为常住内存，会存储在内存堆中。
复杂类型会存储在内存堆中。

## JS 垃圾回收机制

## JS 高级技巧

### 惰性载入函数

为了解决函数中的 if else 语句不是每次都是必须执行，为了避免执行不必要的代码。惰性载入表示函数执行的分支仅会发生一次，优点就是只在执行代码分支时牺牲一点性能。

1. 函数被调用时再次处理函数每次重写原函数，最后将原函数的执行结果返回，下一次调用的时候，就会直接调用被分配的函数，这样就不用再次执行 if 语句。

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

函数绑定要创建一个函数，可以在特定的 this 环境中以指定参数调用另一个函数。常常和回调函数和事件处理程序一起使用，以便将函数作为变量传递的同时保留代码执行环境。

只要是将函数以值得形式进行传递，并且该函数必须在特定得环境中执行，就需要使用到函数绑定得技巧。主要用于事件处理程序以及 setTimeout 和 setInterval。缺点比普通函数需要更多得内存，并且多重函数得调用也慢一点。

1. 实现将函数绑定到指定环境的函数，bind()
   bind()函数返回一个在给定环境中调用给定函数的函数。
   ECMAScript5 原生实现了 bind 方法，这个方法可以直接在函数上调用。

```js
function bind(fn, context) {
  return function () {
    return fn.apply(context, arguments);
  };
}

// 原生bind, 执行的结果返回一个函数。
fn.bind(context);
```

### 函数柯里化（function currying）

函数柯里化与函数绑定紧密相关，函数柯里化得基本方法和函数绑定一样: 使用一个闭包返回一个函数。两者的区别在于，当函数被调用时，返回的函数还需要设置一些传入的参数。

```js
function add(num1, num2) {
  return num1 + num2;
}
function curryingAdd(num1) {
  return function (num2) {
    return num1 + num2;
  };
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
  };
}
const curriedAdd = curry(add, 5);
curriedAdd(3);
```

函数柯里化作为函数绑定的一部分,构造出更为复杂的 bind 函数。

```js
function bind(fn, context) {
  const innerArgs = Array.prototype.slice.call(arguments, 2);
  return function () {
    const innerArgs = Array.prototype.slice.call(arguments);
    const finalArgs = args.concat(innerArgs);
    return fn.apply(context, finalArgs);
  };
}
// 使用bind函数
bind(fn, context, args1)(args2);
```

ECMAScript5 的 bind 方法也是先函数柯里化，只要在 this 的值之后再传入另一个参数即可。

```js
fn.bind(obj, "xxx")();
```

javaScript 中的柯里化函数和绑定函数都提供了强大的动态函数创建功能。使用 bind()还是 curry()要根据是否需要 object 对象响应来决定。两者都不能滥用，每个函数都会带来额外的开销。

### 防篡改对象

任何对象都可以被在同意环境中运行的代码修改，通常开发 JavaScript 库的时候会需要定义防篡改对象。

一旦把对象定义为防篡改就无法撤销了。

1. 不可扩展对象
   Object.preventExtension()不能再给对象添加属性和方法。

```js
const person = { name: "coke" };
Object.preventExtension(person);

// 判断对象是否可以扩展
Object.isExtensible(person);
```

2. 密封的对象
   Object.seal()方法封闭一个对象，阻止添加或者删除属性，并将所有现有属性标记为不可配置，即将 Configurable 特性设置为 false。当前属性的值只要原来是可写的就可以改变。

```js
const person = { name: "coke" };
Object.seal(person);

// 判断对象是否密封
Object.isSealed(person);
```

3. 冻结的对象
   最严格的防篡改级别是冻结对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。而且对象的属性的 Writable 特性会被设置为 false。

如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。所以 freeze 只是浅冻结，要使对象不可变，需要递归冻结每个类型为对象的属性（深冻结）。

冻结 JavaScript 库的主要对象能够防止意外修改了库中的核心对象。

```js
const person = { name: "coke" };
Object.freeze(person);

// 判断对象是否冻结
Object.isFrozen(person);

// 深冻结函数
function deepFreeze(obj) {
  // 取回定义在obj上的属性名
  var propNames = Object.getOwnPropertyNames(obj);

  // 在冻结自身之前冻结属性
  propNames.forEach(function (name) {
    var prop = obj[name];

    // 如果prop是个对象，冻结它
    if (typeof prop == "object" && prop !== null) deepFreeze(prop);
  });

  // 冻结自身(no-op if already frozen)
  return Object.freeze(obj);
}

obj2 = {
  internal: {},
};

deepFreeze(obj2);
obj2.internal.a = "anotherValue";
obj2.internal.a; // undefined
```

### 高级定时器

定时器是计划代码在未来的某个时间执行，但是执行时机是不能保证的，因为在页面的生命周期中，不同的时间可能有其他代码在控制 JavaScript 进程。在页面下载完后的代码运行，事件处理程序，Ajax 回调函数都必须使用同样的线程来执行。
实际上，浏览器负责进行排序，指派某段代码在某个时间点运行的优先级。

### JavaSCript 运行机制

JavaScript 运行 主要包括 JavaScript 执行进程和任务队列，执行进程用于执行代码，任务队列用于接收需要放入执行进程执行的任务代码。
在 JavaScript 中没有任何代码是立刻执行的，但一旦执行进程空闲则尽快执行。

#### setTimeout 定时器

定时器对队列的工作方式是，当特定时间过去后将代码插入。给任务队列添加代码并不意味着对它立刻执行。设定一个 150ms 后执行的定时器不代表到了 150ms 代码就立刻执行，它表示代码会在 150ms 后会被加入到任务队列中。如果在这个时间点上，队列中没有其他东西，那么这段代码就会被执行。其他情况下，代码可能等待更长时间才执行。

定时器最重要的事情是，指定的时间间隔表示何时将定时器的代码添加到队列，而不是何时实际执行代码。

### setInterval 重复的定时器

setInterval 创建的定时器确保了定时器代码规则地插入到任务队列。但存在地问题是定时器代码可能在代码再次添加到队列之前还没有执行完，结果导致定时器代码连续运行了多次，而之间没有任何停顿。JavaScript 引擎会在当任务队列没有该定时器的任何代码实例时，才将定时器代码添加到队列。确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

这种方式处理重复的定时器也有 2 个问题：1.某些间隔的定时器代码会被跳过；2.多个定时器的代码执行之间的间隔可能会比预期的小。

使用链式 setTimeout(), 避免 setInterval()重复定时器的缺点。在前一个定时器代码执行完之前，不会像队列插入新的定时器代码，确保不会有任何缺失的间隔。而且，它保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免了连续的运行。这个模式主要用于重复定时器。

```js
setTimeout(function () {
  // handle code
  setTimeout(arguments.callee, interval), interval;
});
```

### 定时器应用-数组分割处理数据

由于 JavaScript 的执行是一个阻塞操作，脚本运行所花的时间越久，用户无法与页面交互的时间越久。
过长，过深的嵌套的函数调用和大量的循环处理都可能造成脚本的长时间运行。而运行在浏览器中 JavaScript 都被分配了一个确定数量的资源，以防止 web 程序导致用户的计算机宕机。

为了解决某个循环占用大量的时间，有两种思考方向：1.是否为同步，这个数据的处理是否会造成其他运行的阻塞。2.是否必须按顺序完成，如果顺序不重要，那么可以推迟处理。
如果以上两种假设都是否，就可以使用定时器分割这个循环。通过使用数组分块的技术，小块地处理数组，每次一小块。

基本思路是为要处理地项目创建一个队列，然后使用定时器取出下一个要处理地项目进行处理，接着再设置另一个定时器。

数组分块处理函数
数组分块地重要性在于它可以将多个项目地处理在执行队列上分开，在每个项目处理之后，给予其他的浏览器处理机会运行，这样避免长时间运行脚本地错误。

一旦某个函数需要花 50ms 以上的时间完成，那么可以考虑是否可以将任务分割为一系列可以使用定时器的小任务。

```js
function chunk(array, process, context) {
  setTimeout(function () {
    // 取出下一条数据进行处理
    const item = array.shift();
    process.call(context, item);
    // 如果还有数据，再设置另一个定时器
    if (array.length > 0) {
      setTimeout(arguments.callee, 100);
    }
  }, 100);
}
const array = [1, 23, 4, 5, 7];
const process = function (item) {};
// 使用concat克隆数组，避免改变原数组
chunk(array.concat(), process, context);
```

### 定时器应用-函数节流

浏览器中的 DOM 操作比起非 DOM 操作需要更多的内存和 CPU 时间。连续尝试进行过多的 DOM 操作可能会导致浏览器崩溃。

此时使用定时器对操作 DOM 的函数进行节流。

函数节流的基本思想是指，某些代码不可以在没有间断的情况下连续重复执行。第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用该函数时，它会清除前一次的定时器，并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。目的就是只有在执行函数的请求停止了一段时间之后才执行。

```js
const processor = {
  timeoutId: null,
  // 实际进行处理的方法
  performProcessing: function () {
    // 实际执行的代码
  },
  // 初始处理调用的方法
  process: function () {
    clearTimeout(this.timeoutId);
    const that = this;
    this.timeoutId = setTimeout(function () {
      that.performProcessing();
    }, 100);
  },
};
// 开始执行
processor.process();
```

这个模式可以使用 throttle()函数来简化，这个函数可以自动 进行定时器的设置和清除。

```js
function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function () {
    method.call(context);
  }, 100);
}
```

节流在 resize 事件中常用，如果给予该事件改变页面的布局，最好控制处理频率，以确保浏览器不会在极短的时间内进行过多的计算。

```js
function resizeDiv() {
  const div = document.getElementById("myDiv");
  div.style.height = div.offsetWidth + "px";
}

window.onresize = function () {
  throttle(resizeDiv);
};
```

只要代码是周期性执行的，都应该使用节流，但是你不能控制请求执行的速率。

### 自定义事件

事件是 JavaScript 与浏览器进行交互的主要途径。事件是一种叫做观察者的设计模式，这是一种创建松散耦合代码的技术。

观察者模式由主体和观察者组成。主体发布事件，观察者通过订阅这些事件来观察主体。该模式的关键是主体并不知道观察者的任何事情，也就是说它可以独自存在并正常运作即使观察者不存在。观察者知道主体，并能注册事件的回调函数（事件处理程序）。DOM 元素便是主体，事件处理代码便是观察者。

事件是与 DOM 交互的最常见的方式，但它们也可以用于非 DOM 代码中，通过实现自定义事件。自定义事件就是创建一个管理事件的对象，让其他对象监听那些事件。

```js
function EventTarget() {
  this.handlers = {}; // 存储事件处理程序
}
EventTarget.prototype = {
  constructor: EventTarget,
  // 注册给定类型事件的事件处理程序
  addHandler: function (type, handler) {
    if (typeof this.handlers[type] == "undefined") {
      this.handler[type] = [];
    }
    this.handlers[type].push(handler);
  },
  // 触发一个事件
  fire: function (evnt) {
    if (!event.target) {
      event.target = this;
    }
    if (this.handlers[event.type] instanceof Array) {
      const handlers = this.handlers[event.type];
      for (let i = 0, len = handlers.length; i < len; i++) {
        handlers[i](event);
      }
    }
  },
  // 注销某个事件类型的事件处理程序
  removeHandler: function (type, handler) {
    if (this.handlers[type] instanceof Array) {
      const handlers = this.handlers[type];
      for (let i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i] === handler) {
          break;
        }
      }
      handlers.splice(i, 1);
    }
  },
};

// 使用EventTarget类型的自定义事件
function handleMessage(event) {
  alert("Message received" + event.message);
}
// 创建一个事件对象实例
const target = new EventTarget();

// 添加一个事件处理程序
target.addHandler("message", handleMessage);

// 触发事件
target.fire({ type: "message", message: "hello world" });

// 删除事件处理程序
target.removeHandler("message", handleMessage);
```

### 鼠标拖放功能

点击某个对象，并按住鼠标按钮不放，将鼠标移动到另一个区域，然后释放鼠标按钮将对象放在这里。
实现拖放功能：

```js
const DragDrop = (function () {
  // 存放被拖动的元素
  let dragging = null;
  let diffX = 0;
  let diffY = 0;
  function handleEvent(event) {
    // 获取事件和事件目标对象
    event = EventUtil.getEvent(event);
    const target = Event.getTarget(event);
    // 确定事件类型
    switch (event.type) {
      case "mousedown":
        if (target.className.indexOf("draggable") > -1) {
          dragging = target;
          diffX = event.clientX - target.offsetLeft; // 计算元素左上角与指针位置之间的差值
          diffY = event.clientY - target.offsetTop;
        }
        break;
      case "mousemove":
        if (dragging !== null) {
          dragging.style.left = event.clientX - diffX + "px";
          dragging.style.top = event.clientY - diffY + "px";
        }
        break;
      case "mouseup":
        dragging = null;
        break;
    }
    return {
      enable: function () {
        EventUtil.addHandler(document, "mousedown", handleEvent);
        EventUtil.addHandler(document, "mousemove", handleEvent);
        EventUtil.addHandler(document, "mouseup", handleEvent);
      },
      disable: function () {
        EventUtil.removeHandler(document, "mousedown", handleEvent);
        EventUtil.removeHandler(document, "mousemove", handleEvent);
        EventUtil.removeHandler(document, "mouseup", handleEvent);
      },
    };
  }
})();

// 需要拖动的元素必须是绝对定位的。
<div class="draggable" style="positions:absolute;background:red"></div>;
```

为 DragDrop 对象添加自定义事件

```js
const DragDrop = (function () {
  const dragdrop = new EventTarget();
  let dragging = null;
  let diffX = 0;
  let diffY = 0;
  function handleEvent(event) {
    // 获取事件和事件目标对象
    event = EventUtil.getEvent(event);
    const target = Event.getTarget(event);
    // 确定事件类型
    switch (event.type) {
      case "mousedown":
        if (target.className.indexOf("draggable") > -1) {
          dragging = target;
          diffX = event.clientX - target.offsetLeft; // 计算元素左上角与指针位置之间的差值
          diffY = event.clientY - target.offsetTop;
          dragdrop.fire({
            type: "dragstart",
            target: dragging,
            x: event.clientX,
            y: event.clientY,
          });
        }
        break;
      case "mousemove":
        if (dragging !== null) {
          dragging.style.left = event.clientX - diffX + "px";
          dragging.style.top = event.clientY - diffY + "px";
          // 触发自定义事件
          dragdrop.fire({
            type: "drag",
            target: dragging,
            x: event.clientX,
            y: event.clientY,
          });
        }
        break;
      case "mouseup":
        dragdrop.fire({
          type: "dragend",
          target: dragging,
          x: event.clientX,
          y: event.clientY,
        });
        dragging = null;

        break;
    }
  }
  dragdrop.enable = function () {
    EventUtil.addHandler(document, "mousedown", handleEvent);
    EventUtil.addHandler(document, "mousemove", handleEvent);
    EventUtil.addHandler(document, "mouseup", handleEvent);
  };
  dragdrop.disable = function () {
    EventUtil.addHandler(document, "mousedown", handleEvent);
    EventUtil.addHandler(document, "mousemove", handleEvent);
    EventUtil.addHandler(document, "mouseup", handleEvent);
  };
  return dragdrop;
})();

// 为DragDrop对象的每个事件添加事件处理程序
DragDrop.addHandler("dragstart", function () {});
DragDrop.addHandler("drag", function () {});
DragDrop.addHandler("dragend", function () {});
```

### Web 存储机制

Web Storage 是为了克服 cookie 带来的一些局限性，使得数据保存在客户端，无须持续地将数据发回服务器。
Web Storage 提供了一种在 cookie 之外存储会话数据的途径。提供了一种存储大量可以跨会话存在的数据的机制。

#### Storage 对象

包含 localStorage 和 sessionStorage。
sessionStorage 是基于会话的，即页面关闭，数据删除。
localStorage 则会一直保存直到通过 JavaScript 删除或者用户清除浏览器缓存。要访问同一个 localStorage 对象，页面必须是同一个域名一个协议一个端口。
Storage 对象只能存储字符串，非字符串在存储之前会被转换成字符串。

对于 Storage 存储数据量大小的限制，不同浏览有差异，一般为 2.5MB-5MB 之间。

```js
// 清空
Storage.clear();
// 获取某个键的值
Storage.getItem(name);
// 设置键值
Storage.setItem(name, value);
// 删除键值
Storage.removeItem(name);
// 获取某个索引的键名
Storage.key(index);
```

### IndexedDB

Indexed Database API 简称 IndexedDB,是浏览器中保存结构化数据的一种数据库。

## JavaScript 最佳实践

### 可维护代码

- 可理解性
- 直观性
- 可适应性
- 可扩展性
- 可调试性

### 代码约定

1. 可读性
   缩进：可读性与代码文本文件的格式有关，具体来说 统一的缩进方式，会让项目代码更加易于阅读。通常使用 4 个空格表示缩进，不使用制表符，是因为制表符在不同的文本编辑器中显示效果不一样。

注释：函数和方法需要包含注释，注释由两部分组成，一是函数的目的，二是函数的输入输出。
完成单个任务的大段代码，也需要注释。
解决某个问题的复杂算法，也需要注释。
解决浏览器差异的 hack 方法，也需要注释。 2. 变量和函数的命名
变量名应该为名词。
函数名应该以动词开始。返回布尔类型值的函数一般以 is 开头。

3. 指明变量类型
   初始化的方式，指明某个变量应该保存什么样类型的数据。

### 松散耦合

项目的某个部分过分依赖于另一部分，代码就是耦合过紧，难于维护。

1. 解耦 HTML/JavaScript
   常见的耦合类型就是 HTMl/JavaScript 耦合，因为 HTML 是页面中显示的数据，JavaScript 是行为。它们之间的交互是非常常见的。直接写在 HTML 中的 JavaScript，使用包含 script 标签包含的内联 js 脚本或者是通过 HTML 属性来分配的事件处理程序都是过于紧密的耦合。

HTML 和 JavaScript 紧密耦合带来的问题就是当出现 JavaScript 错误时，无法判断错误是在 HTML 中还是 JavaScript 中。

HTML 和 JavaScript 应该尽可能保持分离，当用 js 用于插入数据时，尽量不要直接插入标记。一般可以在页面中直接包含并隐藏标记，然后等到整个页面渲染好之后，就可以用 js 显示改标记，而非生成它。另一种方法是进行 Ajax 请求并获取更多要显示的 HTML，这个方法可以让同样的渲染层(php,jsp,ruby 等)来输出标记，而不是嵌在 js 中。

将 HTML 和 JS 解耦可以在调试的过程中节省时间，更加容易确定错误的来源，也减轻维护的难度；更改行为只需要在 js 文件中进行，而更改标记则只要在渲染文件中。

```html
<!-- 使用script的内联脚本 -->
<script type="text/javascript">
  document.write("hello");
</script>

<!-- 使用事件处理程序的HTML属性 -->
<input type="button" value="clike" onclick="clickEvent()" />

<!-- JavaScript 包含HTML -->
function insertMessage(msg) { const container =
document.getElementById("container"); container.innerHTML = "
<div>hello</div>
" }
```

2. 解耦 CSS/JavaScript
   CSS 主要负责页面的显示效果。js 和 css 也是紧密相关的，常见的耦合情况就是使用 js 改变某些样式。

css 负责页面的显示，当显示出现任何问题的时候，都应该只是查看 CSS 文件来解决。然而当使用了 js 来更改样式的时候，就出现了第二个可能已更改和必须检查的地方。结果就是 js 在某种程度上负责了页面的显示，与 css 紧密耦合了。为了避免未来更改样式表，css 文件和 js 文件都需要修改，所以在这两个层次之间必须由清晰的划分。

现代 web 应用常常需要使用 js 更改样式，虽然不能完全将两者解耦，但是可以让耦合松散。通过动态更给样式类而非特定的样式来实现，通过只修改某个元素的 CSS 类，就可以让大部分的样式信息严格保留在 css 中。js 可以更改样式类，但并不会直接影响到元素的样式。只要应用了正确类，那么任何显示问题都可以直接追溯到 css 而非 js。

显示问题的唯一来源应该是 css，行为问题的唯一来源应该是 js。

```js
// css 对js的紧密耦合
element.style.color = "red";
// css 对js的松散耦合
element.className = "edit";
```

3. 解耦应用逻辑/事件处理程序
   web 应用一般都有很多的事件处理程序，监听着无数不同的事件，应该将应用逻辑从事件处理程序中分离，让两者分别处理各自的东西。一个事件处理程序应该从事件对象中提取相关信息，并将这些信息传送到处理应用逻辑的某个方法中。注意应用逻辑中不会依赖于任何事件处理程序逻辑，只是接受一个值，并根据该值进行其他处理，这样应用逻辑的处理可以在其他的事件处理程序中复用。

从事件处理程序中分离应用逻辑的好处可以应用逻辑处理更好复用，可以在不附加到事件的情况下测试代码，使其更加容易创建单元测试或者是自动化应用流程。

应用和业务逻辑之间松散耦合的几条原则：

1. 勿将 event 对象传给其他方法；只传来自 event 对象中所需要的数据。
2. 任何可以在应用层面的动作都应该可以在不执行任何事件处理程序的情况下进行。
3. 任何事件处理程序都应该处理事件，然后将处理转交给应用逻辑。

```js
// 事件处理程序
function handleKeyPress(event) {
  event = EventUtil.getEvent(event);
  if (event.keyCode == 13) {
    const target = EventUtil.getTarget(event);
    // 应用逻辑
    const value = 5 * parseInt(target.value);
    if (value > 10) {
      document.getElementById("error-msg").style.display = "block";
    }
  }
}

// 将应用逻辑和事件处理程序分离
function validateValue() {
  value = 5 * parseInt(value);
  if (value > 10) {
    document.getElementById("error-msg").style.display = "block";
  }
}

function handleKeyPress(event) {
  // 提取事件信息
  event = EventUtil.getEvent(event);
  if (event.keyCode == 13) {
    const target = EventUtil.getTarget(event);
    // 应用逻辑处理程序
    validateValue(target.value);
  }
}
```

### 编程实践

1. 尊重对象所有权
   不由你创建或维护的对象，不要试图去修改它们。因为 js 是动态的语言，任何东西都可以修改，这样会导致不可预计的覆写了一些默认的行为。
   不要为实例或原型添加属性；
   不要为实例或者原型添加方法；
   不要重新定义已存在的方法；

js 库需要遵守以下两条开发原理，以保证即使浏览器频繁更改，库本身也能继续成长和适应。
通过创建包含所需功能的新对象，并用它与相关对象进行交互；通过创建自定义类型，继承需要进行修改的类型。然后可以为自定义类型添加额外的功能。

2. 避免全局量
   避免全局变量和函数。避免与其他功能产生冲突，有助于消除功能作用域之间的混淆。

单一的全局量的延伸就是命名空间的概念。命名空间包括创建一个用于放置功能的对象。
命名空间很重要的一部分就是使用的全局对象的名字必须保持唯一，大多数情况下可以是开发代码的公司的名字。
命名空间有助于确保代码可以在同一个页面上与其他 js 库的代码以无害的方式一起工作。

```js
// 推荐使用 单一的全局量
var MyApplication = {
  name: "coke",
  sayName: function () {
    alert("coke");
  },
};
```

3. 避免与 null 比较
   由于 js 不做任何自动的类型检查，所以开发人需要自己进行类型检查。
   最常见的类型检查就是查看某个值是否为 null。但是将值与 null 比较是使用过度的，并且由于不充分的类型检查导致错误。

现实中，与 null 比较很少适合情况而被使用。必须按照期望的对值进行检查，而非按照不被期望的那些。

如果值应为一个引用类型，使用 instanceof 操作符检查其构造函数；
如果值应为一个基本类型，使用 typeof 检查其类型；
如果希望对象包含某个特定的方法名，则使用 typeof 操作符确保指定名字的方法存在于对象上。

```js
function sortArray(values) {
  if (values != null) {
    // 避免使用
    values.sort(comparator);
  }
}
```

4. 使用常量
   通过将数据抽取出来变成单独定义的常量的方式，将应用逻辑和数据修改隔离开来。这样数据在无须接触使用它的函数的情况下进行更改。

重复值-多处使用到的值，应该抽取为一个常量。
用户界面字符串-任何用于显示给用户的字符串，都应被抽取出来以方便国际化。
URLs-在 web 应用中，资源位置很容易变更，使用一个公共地方存放所有的 URL。
任意可能会更改的值-使用的值在未来是不是会变化，会变化就应该抽取出来作为一个常量。

### JS 性能

#### 注意作用域链

减少花费在作用域链上的时间，就能增加脚本的整体性能。

1. 避免全局查找，使用全局变量和函数比局部的开销大。
   通过创建一个指向全局变量的局部变量，就可以通过限制一次全局查找来改进这个函数的性能。

```js
// 多次进行作用域链查找全局变量document
function updateUI() {
  const imgs = document.getElementsByTagName("img");
  for (let i = 0, len = imgs.lenght; i < len; i++) {
    imgs[i].title = document.title + " image " + i;
  }
}

// 使用局部变量保存全局变量
function updateUI() {
  const doc = document;
  const imgs = doc.getElementsByTagName("img");
  for (let i = 0, len = imgs.lenght; i < len; i++) {
    imgs[i].title = doc.title + " image " + i;
  }
}
```

2. 避免 with 语句
   在性能非常重要的地方要避免使用 with 语句。with 语句会创建自己的作用域，因此会增加其中执行的代码的作用域链的长度。由于额外的作用域链查找，在 with 语句中执行的代码，会比外面执行的代码更慢。使用局部变量保存对象，也可以达到相同的作用。

#### 选择正确的方法

1. 避免不必要的属性查找
   访问变量的字面量值和数组要比访问对象上的属性更有效率，前者是 O(1)，后者是 O(n)。对象上的任何属性查找都要比访问变量或者数组花费更长时间，因为必须在原型链中对拥有该名称的属性进行一次搜索。属性查找越多，执行时间就越长。

一旦多次用到对象属性，就应该将其存储在局部变量中，第一次访问该值会是 O(n),而后续访问都会是 O(1),就会节省很多。

一般来讲，只要能减少算法的复杂度，就要尽可能减少。尽可能多地使用局部变量将属性查找替换为值查找，进一步将，如果既可以用数字化的数组位置进行访问，也可以使用命名属性，那么使用数字位置。（如 NodeList 对象）

```js
// 字面量
const a = "123";
const b = [1, 2, 3];
console.log(a, b[1]);
// 访问对象上的属性
const obj = { name: "coke" };
console.log(obj.name);
```

2. 优化循环

- 减值迭代，从最大值开始，在循环中不断减值地迭代器更加高效。
- 简化终止条件，每次循环地过程都会计算终止条件，必须保证终止条件地计算尽可能地快。避免属性查找和其他 O(n)操作。
- 简化循环体，循环体执行最多，要确保其被最大限度地优化。确保没有某些可以被很容易一处循环地密集计算。
- 使用后测试循环，for 循环和 while 循环都是前测试循环，而 do-while 是后测试循环。后测试循环可以避免最初终止条件的计算，因此运行更快。后测试循环必须确保要处理的值至少有一个。空数组会导致多余的一次循环而前测试可以避免。

3. 展开循环
   当循环的次数是确定的，消除循环并使用多次函数调用往往会更快。因为消除了建立循环和处理终止条件的额外开销，使得代码运行得更快。

Duff 装置技术处理大数据集

4. 避免双重解释
   当 js 代码像解析 js 的时候就会存在双重解释的问题。当使用 eval()函数或者是 Function 构造函数以及 setTimeout 传入一个字符串参数的时候就会发生这种情况。

js 代码运行的同时必须重新启动一个解析器来解析新的代码。实例化一个新的解析器有不能忽视的开销，所以这种代码要比直接解析慢得多。

要提升代码性能，尽可能避免出现需要按照 JS 解释的字符串。

```js
// 避免
eval("alert ('hello')");

// 避免
const sayHi = new Function("alert ('hello')");

// 避免
setTimeout("alert ('hello')", 500);
```

5. 性能的其他注意事项

- 原生方法较快-使用原生方法而不是使用 js 自己实现。原生方法是用诸如 C/C++之类的编译性语言写出来的，所以要比 js 快很多。
- Switch 语句较快-如果有一些列复杂的 if-else 语句，可以转换成单个 switch 语句则可以得到更快的代码。可以通过将 case 语句按照最可能的到最不可能的顺序进行组织，来进一步优化 switch 语句。
- 位运算符较快- 当金星数学运算的时候，位运算的操作要比任何布尔运算或者算数运算快。

#### 最小化语句数

js 代码中的语句数量也影响所执行的操作的速度。完成多个操作的单个语句要比完成单个操作的多个语句快。
找出可以组合在一起的语句，以减少脚本的整体执行时间。

1. 多个变量声明

```js
// 多个语句的 变量声明
const count = 5;
const color = "red";
const value = [1, 2, 3];
const now = new Date();

// 一个语句
const count = 5,
  color = "red",
  value = [1, 2, 3],
  now = new Date();
```

2. 插入迭代值
   合并迭代值的递增语句和获取数组值的语句。

```js
const name = values[i];
i++;

// 合并之后
const name = values[i++];
```

3. 使用数组和对象字面量
   两种创建数组和对象的方法：使用构造函数和使用字面量。
   尽量使用数组和对象字面量表达方式消除不必要的语句。

```js
const values = [123, 456];
const person = {
  name: "coke",
  age: 25,
};
```

#### 优化 DOM 交互

DOM 操作与交互要消耗大量时间，因为它们往往需要重新渲染整个页面或者某一部分。

1. 最小化现场更新
   要访问的 DOM 已经是页面的一部分，就意味着在进行一个现场更新，即立即对页面的显示进行更新。每一个更改，不管是插入单个字符，还是移除整个片段，都有一个性能惩罚，因为浏览器要重新计算无数尺寸以进行更新。现场更新进行得越多，代码执行所花得时间就越长。

```js
// 进行了20个现场更新
let list = document.getElementById("myList"),
  i,
  item;
for (i = 0; i < 10; i++) {
  item = document.createElement("li");
  list.appendChild(item);
  item.appendChild(document.createTextNode("Item" + i));
}
// 改进
// 方法1：将列表从页面上移除，最后进行更新，最后将列表插回同样的位置。缺点是造成页面闪烁的问题
// 方法2： 使用文档碎片来构建DOM结构，接着将其添加到List元素中。这个方式避免了现场更新和页面闪烁的问题。
let list = document.getElementById("myList"),
  fragment = document.createDocumentFragment(),
  i,
  item;
for (i = 0; i < 10; i++) {
  item = document.createElement("li");
  fragment.appendChild(item);
  item.appendChild(document.createTextNode("Item" + i));
}
list.appendChild(fragment);
```

文档碎片用作一个临时的占位符，放置新创建的项目。当给 appendChild()传入文档碎片时，只有碎片中的子节点被添加到目标，碎片本身不会被添加。

一旦需要更新 DOM，考虑使用文档碎片来构建 DOM 结构，再将其添加到现存的文档中。

2. 使用 innerHTML
   当把 innerHTML 设置位某个值的时候，后台会创建一个 HTML 解析器，然后使用内部的 DOM 调用来创建 DOM 结构，而非使用 js 的 DOM 调用。由于内部方法时编译好的而非解释执行的，所以快的多。

因此对于大的 DOM 更改，使用 innerHTML 比使用 createElement 和 appendChild 创建 DOM 结构会快得多。
对于使用 innerHTML，应该先构建一个 HTML 字符串，然后调用一次 innerHTML。innerHTML 也是一次现场更新，要减少调用的次数。

3. 使用事件代理
   对于可以冒泡的事件可以在其祖先节点上处理。可以将事件处理程序附加到更高层的地方负责多个目标的事件处理.

4. 注意 HTMLCollection
   任何时候访问 HTMLCollection,不管是一个属性还是一个方法,都是在文档上进行查询,这个查询开销很大.最小化访问 HTMLCollection 的次数可以极大改进脚本的性能.

发生以下情况时会返回 HTMLCollection 对象:
进行了对 getElementsByTagName()的调用;
获取了元素的 childNodes 属性;
获取了元素的 attributes 属性;
访问了特殊的集合,如 document.forms,document.images 等.

```js
// 保存了HTMLCollection 的长度, 不用每次去访问imgages的HTMLCollection了.
let images = document.getElementsByTagName("img"),
  image,
  i,
  len;
for (i = 0, len = images.length; i < len; i++) {
  image = images[i];
}
```
### 部署
#### 构建
#### 验证
#### 压缩

## Web API
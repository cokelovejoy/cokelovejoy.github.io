---
title: js实现
date: 2020-08-15 13:16:56
tags:
---
防抖节流的作用都是为了控制时间触发的频率，提高性能。
都使用了setTimeout，控制函数的执行时机。
# 实现防抖函数(debounce)
防抖函数原理： 在事件被触发n秒后再执行回调，如果再这n秒内又被触发，则重新计时。计时期间持续触发不执行，不触发的一段时间之后再执行。

使用场景：
1. 按钮提交场景：防止多次提交按钮，只执行最后提交的一次。
2. 服务端验证场景：表单验证需要服务端配合，只执行一段连续的输入事件的最后一次。类似于搜索功能。

生产环境使用lodash.debounce()
手写简化版-1
```js
function debounce(fn, delay) {
    let timer = null
    return function () {
        if (timer) {
            clearTimeout(timer)
        } 
        timer = setTimeout(fn, delay)
    }
}
```

# 实现节流函数(throttle)
计时期间内持续触发并不会执行多次，而是到指定时间始终会去执行一次。
适用场景：
1. 拖拽场景： 固定时间内只执行一次，防止超高频次触发位置变动。
2. 缩放场景：监控浏览器resize
3. 动画场景： 避免短时间内多次触发动画引起性能问题。
手写简化版-1
```js
function throttle(fn, delay) {
    let flag = true
    return function () {
        if (!flag) {      // 定时期间，操作无效，直接退出
            return
        }
        flag = false      // 开始进入定时内，将标志位设为false
        setTimeout(() => { // 由定时器控制，到时间了就触发事件函数执行
            fn()
            flag = true   // 重置标志位
        }, delay)
    }
}
```
手写简化版-2
```js
function throttle(fn, delay) {
    let timer = null
    return function (...args) {
        let that = this
        if (!timer) {
            timer = setTimeout(function() {
                timer = null
                fn.apply(that, args)
            }, delay)
        }
    }
}
```
# JS 实现深拷贝和浅拷贝(deep clone)
深拷贝：开辟一个新的内存空间来保存对象，原来的对象改变不会影响新的对象。
浅拷贝：拷贝的是对象引用，原来的对象改变会影响新的对象。

## 简单版
局限性：
1. 无法实现对函数，RegExp等特殊对象的克隆。
2. 会抛弃对象的constructor，所有的构造函数都会指向Object。
3. 对象有循环引用会报错

```js
const newObj = JSON.parse(JSON.stringify(oldObj))
```

## 面试版
局限性:
1. 对于一些特殊的情况没有处理：例如Buffer对象，Promise，Set，Map
2. 另外对于确保没有循环引用的对象，我们可以省去对循环引用的特殊处理，因为这很耗时。
```js
function deepClone(parent) {
    // 判断输入数据类型，是否为对象
    const isType = (obj, type) => {
        if (typeof obj !== "object") return false
        const typeString = Object.prototype.toString.call(obj)
        let flag
        switch (type) {
            case "Array":
                flag = typeString === "[object Array]"
                break
            case "Date":
                flag = typeString === "[object Date]"
                break
            case "RegExp":
                flag = tyeString === "[object RegExp]"
                break
            default:
                flag = false
        }
        return flag
    }
    // 处理正则
    const getRegExp = re => {
        let flags = ""
        // 是否有global
        if (re.global) flags += "g"
        if (re.ignoreCase) flags += "i"
        if (re.multiline) flags += "m"
        return flags
    }
    // 维护两个储存循环引用的数组
    const parents = []
    const children = []
    const clone = parent => {
        if (parent === null) return null
        if (typeof parent !== "object") return parent
        let child, proto
        if (isType(parent, "Array")) {
            // 传入的是数组  
            child = []
        } else if (isType(parent, "RegExp")) {
            // 传入的是RegExp
            // parent.source 就是 正则表达式的文本 字符串
            // getRegExp(parent) 返回匹配的模式的字符串， 'g' 'i' 'm'
            // 创建一个新的正则实例
            child = new RegExp(parent.source, getRegExp(parent))
            // 正则对象lastIndex属性表示下一次匹配开始的位置
            if (parent.lastIndex) child.lastIndex = parent.lastIndex
        } else if (isType(parent, "Date")) {
            // 传入的是Date对象
            // 通过getTime() 获取Date实例的时间字符串。
            child = new Date(parent.getTime())
        } else {
            // 普通对象
            // getPrototypeOf()获取对象的原型
            proto = Object.getPrototypeOf(parent)
            // create(xx) 创建一个对象，该对象以传入的参数作为原型。
            child = Object.create(proto)
        }
        // 处理循环引用
        const index = parents.indexOf(parent)
        if (index != -1) {
            // 如果父数组存在本对象，说明之前已经被引用过，直接返回此对象
            return children[index] 
        }
        // parent 用来存传入的对象，可能被重复引用了。
        parents.push(parent)
        // children用来存返回的新对象。
        children.push(child)
        for (let i in parent) {
            // 递归
            child[i] = clone(parent[i])
        }
        return child
    }
    return clone(parent)
}
```

# 实现Event(event bus)
Event bus 既是node中各个模块的基石，又是前端组件通信的依赖手段之一，同时涉及了订阅-发布模式，是非常重要的基础。

简单版：
```js
class EventEmitter {
    constructor () {
        this._events = this._events || new Map() // 存储事件/回调键值对
        this._maxListeners = this._maxListeners || 10 // 设置监听上限 
    }
}

// 触发名为type的事件
EventEmitter.prototype.emit = function (type, ...args) {
    let handler 
    handle = this._enents.get(type) // 获取事件函数
    if (args.length > 0) {
        handler.apply(this, args)   // 执行事件函数
    } else {
        handler.call(this)          // 执行事件函数
    }
    return true
}

// 监听名为type的事件
EvemtEmitter.prototype.addListener = function (type, fn) {
    // 将type事件以及对应的fn函数放入this._events存储
    if (!this._events.get(type)) {
        this._events.set(type, fn)  // 设置监听名为type 和 事件函数fn 的map实例
    }
}
```
面试版：
```js
// 实现Event bus - 面试版
class EventEmitter {
    constructor () {
        this._events = this._events || new Map
        this._maxListeners = this._maxListeners || 10
    }
}

EventEmitter.prototype.emit = function (type, ...args) {
    let handler
    handler = this._events.get(type)
    // 如果是一个数组说明有多个监听者，需要依次触发里面的函数
    if (Array.isArray(handler)) {
        for (let i = 0; i < handler.length; i++) {
            if (args.length > 0) {
                handler[i].apply(this, args)
            } else {
                handler[i].call(this)
            }
        }
    } else {
        // 单个函数的情况，直接触发
        if (args.length > 0) {
            handler.apply(this, args)
        } else {
            handler.call(this)
        }
    }
    return true
}

EventEmitter.prototype.addListener = function (type, fn) {
    // 获取对应事件名称的函数list
    const handler = this._events.get(type)

    if (!handler) {
        // 没有处理函数
        this._events.set(type, fn)
    } else if (handler && typeof handler === 'function') {
        // 如果handler是函数说明只有一个监听者, 用数组存储
        this._events.set(type, [handler, fn]) 
    } else {
        handler.push(fn)  // 多个监听者，存储到数组
    }
}

EventEmitter.prototype.removeListener = function (type, fn) {
    const handler = this._events.get(type)

    // 如果是函数，只被监听了一次
    if (handler && typeof handler == 'function') {
        this._events.delete(type, fn)
    } else {
        // handler 是数组，找到对应的fn删掉
        let postion
        for (let i = 0; i < handler.length; i++) {
            if (handler[i] === fn) {
                postion = i
            } else {
                postion = -1
            }
        }
        if (postion !== -1) {
            // 在数组中删除fn
            handler.splice(postion, 1)
            // 如果handler数组中只有一个函数，取消数组，使用函数形式保存
            if (handler.length === 1) {
                this._events.set(type, handler[0])
            }
        } else {
            return this
        }
    }
}
```

# 实现instanceOf
```js
// 模拟instanceOf
//  L instanceOf R
// L 表示左表达式，P表示右表达式

function instance_of(L, R) {
    // 获取R的原型
    let o = R.prototype
    // 获取L的原型
    L = L.__proto__
    // 一直迭代判断两者的原型是否完全相等
    while (true) {
        if (L === null) return false
        if (o === L) return true
        // 向上寻找L的原型
        L = L.__proto__
    }
}
```

# 模拟new
new 操作符做了这些事：
1. 创建了一个全新的空对象。
2. 获取构造函数。
3. 设置空对象的原型。
4. 执行构造函数，绑定this。
4. 确保返回值为对象。

实现：
```js
// objectFactory(className, arg1, arg2)
function objectFactory() {
    // 创建一个空对象
    const obj = new Object()
    // 获取构造函数
    const Consturctor = [].shift.call(arguments)
    // 获取构造函数的原型，并赋给空对象
    obj.__proto__ = Constructor.prototype
    // 绑定this：使用apply，将构造函数中的this指向新对象，这样新对象就可以访问构造函数中的属性和方法
    const ret = Constructor.apply(obj, argument)
    //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
    return ret instanceof Object ? ret : obj
}
function People(name, age) {
    this.name = name
    this.age =age
}
let obj = objectFactory(People, 'coke', '18')
```

# 实现一个call
分析call做了什么：
1. 首先context为可选参数，如果不传的话默认上下文为window
2. 给context创建一个fn属性，并将值设置为需要调用的函数。
3. 因为call可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来。
4. 然后调用函数并将对象上的fn属性删除。
实现call
```js
// 模拟call
Function.prototype.myCall = function (context) {
    if (typeof this !== 'function') {
        throw new TypeError('Type Error')
    }
    // 传入的上下文为null的时候，采用window
    let context = context || window
    // 此处没有考虑context非object情况
    // this就是当前函数，把当前函数作为属性绑定给上下文对象，再删除该属性
    context.fn = this
    // 处理参数
    let args = []
    for (let i = 1,len = arguments.length; i < len; i++) {
        args.push(arguments[i])
    }
    let result = context.fn(...args)
    // 删除属性
    delete context.fn
    return result
}
```
# 实现一个apply
apply原理与call类似, 注意参数

```js
Function.prototype.myApply = function(context) {
    if (typeof context !== 'function') {
        throw new TypeError('type error')
    }
    context  = context || window
    context.fn = this
    let result
    // apply 与call 方法，参数不同
    if (arguments[1]) {
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }
    delete context.fn
    return result
}
```
# 实现bind
1. bind会返回一个函数。
2. 对于参数需要拼接函数调用的时候传入的参数。
3. 返回的函数可以通过new的方式调用。作为构造函数使用的时候，要让this失效，但是传入的参数依然有效。
```js
// 实现bind
Function.prototype.myBind = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this; // this就是原函数
    var args = Array.prototype.slice.call(arguments, 1); // 获取参数数组

    var fNOP = function () {};
    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments); // 获取参数数组
        // 当返回的这个函数以new形式调用，则this 是FNOP的实例，则给原函数绑定为this实例，否则以context为this的指向
        // 参数合并
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }
    fNOP.prototype = this.prototype; // 改变FNOP原型，原型指向原函数的原型
    fBound.prototype = new fNOP();   // 改变FBound原型，使用FNOP做中转
    return fBound;
}

```

# 实现Object.create()
Object.create方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__属性。

```js
function create(proto) {
    function F() {}
    F.prototype = proto
    return new F()
}
```
# 实现类的继承
```js
function Parent(name) {
    this.parent = name
}
Parent.prototype.say = function() {
    console.log('haha')
}
function Child(name, parent) {
    // 绑定父类的构造函数到子类上
    Parent.call(this, parent)
    this.child = name
}
Child.prototype.say = function () {
    console.log(`${this.parent} and ${this.child}`)
}
// 获取父类的原型
Child.prototype = Object.create(Parent.prototype)
// 原型的构造函数属性指向子类自己
Child.prototype.constructor = Child
const parent = new Parent('father')
parent.say()
const child = new Child('coke', 'father') 
child.say
```

ES6语法实现:
```js
Class Animal {
 constructor(name) {
     this.name = name
 }
}
Class cat extends Animal{
    constructor(name) {
        super(name)
        this.color = 'black' 
    }
}
```
# 实现JSON.parse
# 实现Promsise
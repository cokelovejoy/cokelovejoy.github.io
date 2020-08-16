---
title: js实现
date: 2020-08-15 13:16:56
tags:
---
# 实现防抖函数(debounce)
防抖函数原理： 在事件被触发n秒后再执行回调，如果再这n秒内又被触发，则重新计时。计时期间多次触发无效，并重置计时器。

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
计时期间内多次触发无效，到时间触发一次。
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
1. 创建了一个全新的对象。
2. 链接到原型。
3. 使this指向新创建的对象。
4. 返回新对象。

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
    return typeof ret === "object" ? ret : obj
}
function People(name, age) {
    this.name = name
    this.age =age
}
let obj = objectFactory(People, 'coke', '18')
```

# 实现一个call
call做了什么：
1. 改变this的指向，将函数设为对象的属性
2. 执行该函数
3. 删除该函数
实现call
```js
// 模拟call
Function.prototype.myCall = function (context) {
    // 传入的上下文为null的时候，采用window
    let context = context || window
    // 此处没有考虑context非object情况
    // this就是当前函数， 把当前函数作为属性绑定给上下文对象，再删除该属性
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
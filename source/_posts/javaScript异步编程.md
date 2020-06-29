---
title: javaScript异步编程
date: 2020-06-23 10:41:43
tags:
---

# 同步和异步
javascript中将任务的执行方式分为两种：同步和异步。
同步：后一个任务等前一个任务结束之后再执行，程序的执行顺序和任务的排列顺序是一致的。
异步：每一个任务有一个或多个回调函数，前一个任务结束，会去执行它的回调函数。后一个任务不会等前一个任务结束，就会去执行。所以程序的执行顺序与任务的顺序是不一致的，异步的。

# 异步编程
## 为什么需要异步
* JS的执行环境是单线程(single thread)
* I/O处理需要回调函数异步处理(异步I/O)
* 前端异步I/O可以消除UI阻塞，提高用户体验
* 放在后端则可以提高CPU和内存的利用率

## 异步操作串联处理
有时候希望异步操作队列，按照期望顺序执行，比如在某个ajax异步操作之后，获取网络资源之后，再去执行另一个异步操作。这样的需求是很常见的，因此就需要将异步操作串联。
### 回调函数
采用回调的方式，可以把同步操作，变成异步操作。缺点：形成回调地狱，耦合度高，流程混乱，而且每个任务只能指定一个回调函数。
```js
function f1(callback){
    setTimeout(function () {
        // f1的任务代码
        callback();
    }, 1000);
}
// 通过回调的方式，串联异步操作。
f1(f2)
```

### Promise
Promise对象用于异步操作，它表示一个尚未完成且预计在未来完成的异步操作。
```js
const promise = (name, delay = 100) => new Promise(resolve => {
    setTimeout(() => {
        console.log(`Log...${name}:` + new Date().toLocaleTimeString())
        resolve()
    }, delay)
})
promise('promise1').then(promise('promise2')).then(promise('promise3'))
```
### Generator
ES6新引入Generator函数，可以通过yield关键字，把函数的执行流挂起，为改变执行流程提供了可能，从而为异步编程提供解决方案。
function* 称为Generator函数，函数内部有yield表达式。
```js
function* func() {
    console.log('one')
    yield '1'
    console.log('two')
    yield '2'
    console.log('three')
    return '3'
}
const f = func()
console.log(f.next())
// one
// {value: '1', done: false}
console.log(f.next())
// two
// {value: '2', done: false}
console.log(f.next())
// three
// {value: '3', done: true}
console.log(f.next())
// {value: undefined, done: true}

// 通过迭代器执行
for (const v of func()) {
    console.log(v)
}
```
使用generator串联异步操作

```js
// 模拟异步操作
const promise = (name) => new Promise(resolve => {
    setTimeout(() => {
        console.log(`Log...${name}:` + new Date().toLocaleTimeString())
        resolve()
    }, 100)
})
// generator函数
const generatorFunc = function* (name) {
    yield promise(name + 1)
    yield promise(name + 2)
    yield promise(name + 3)
    yield promise(name + 4)
}
// 递归执行generator
const callFunc = function (generator) {
    if (it = generator.next().value) {
        it.then(res => {
            // 递归
            callFunc(generator)
        })
    } else {
        return
    }
}
callFunc(generatorFunc('co-generator'))
```
### async/await
async/await 是es7推出的一套关于异步的终极解决方案。
* 任何一个await语句后面的Promise对象变为reject状态，那么整个async函数都会中断执行。
* async函数返回的Promise对象，必须等到内部所有await命令后面的Promise对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。

```js
const promise = (name) => new Promise(resolve => {
    setTimeout(() => {
        console.log(`Log...${name}:` + new Date().toLocaleTimeString())
        resolve()
    }, 100)
})

const asyncFunc = async function () {
    await promise('async 1')
    await promise('async 2')
    await promise('async 3')
    await promise('async 4')

}

asyncFunc()
```
### 事件监听方式处理
采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。
```js

const asyncFunc = name => event => {
    setTimeout(() => {
        console.log(`Log...${name}:` + new Date().toLocaleTimeString())
        event.emit('end')
    }, 100)
    return event
}

const eventArray = [
    asyncFunc('event1'),
    asyncFunc('event2'),
    asyncFunc('event3'),
]

const { EventEmitter } = require('events')

const event = new EventEmitter()
let i = 0
// 监听end事件
event.on('end', () => i < eventArray.length && eventArray[i++](event))
// 触发end事件
event.emit('end')
```
### EventEmitter源码解析
订阅/发布机制
## 异步操作并行处理
### Promise.all
### Promise.race
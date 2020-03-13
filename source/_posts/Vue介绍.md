---
title: Vue介绍
date: 2019-10-24 10:18:25
tags:
---
## Vue
一套用于构建用户界面的渐进式框架
* 特点
1. 构建用户界面,关注View层
2. 简单易学,简洁,轻量, 快速
3. 渐进式框架

## 库和框架
* 库
库是一些封装好的特定方法的集合,用于实现特定功能,提供给开发者使用, 库没有控制权,控制权在使用者的手中. 代表: jQuery, underscore, util

* 框架
框架就是一套架构,会基于自身的特点向用户提供一套相当完整的解决方案.而且控制权在框架本身,使用者要按照框架所规定的某种规范进行开发.代表: backbone, react, angular, vue

框架和库的关系: 框架包含库.
## 理解渐进式
1. 声明式渲染
2. 组件系统
3. 客户端路由
4. 大规模状态管理
5. 构建工具

## Vue两个核心点
1. 响应式的数据绑定
    当数据发生变化时 -> 视图自动更新
    专注于操作数据, 忘记操作DOM

2. 可组合的视图组件
    把视图按功能切分若干基本单元组件
    组件可以一级一级组合成整个应用, 形成组件树
    使用组件的好处: 可维护, 可重用, 可测试.

## MVVM模式
M: Model数据
V: view视图
vm:view-Model视图模型 (control)
视图(DOM) (数据绑定,DOM监听)     准备数据
v---------------------> vm -------------------->model
v<--------------------- vm <--------------------model

## Vue指令
指令: 是一种特殊的自定义行间属性,以 v-开头
将数据和DOM关联,当表达式的值改变时,响应式地作用在视图.
预期的值为javaScript表达式 (表达式是一定会返回值的)
* v-bind & v-on
v-bind:msg="message" 绑定属性 , 属性值动态改变, 简写 :msg="message"
v-on:click="funcHandler" 绑定事件, 事件处理函数的第一个参数是触发事件的DOM中的event对象.
简写 @click="funcHandler"
event.target: 返回触发此事件的事件源元素.
当在模板中给事件处理函数传递其他参数时,需要把$event作为第一个参数传入.
methods 中的方法中的this 都指向当前组件实例
```html
<!-- 不传参数 -->
<button @click="funcHandler1"></button>
<!-- 传参 -->
<button @click="funcHandler2($event, value)"></button>
<script>
    methods: {
        // event 是 $event ,事件对象
        funcHandler1(event) {
            pass
        },
        // event 是 $event ,事件对象
        funcHandler2(event, params) {
            pass
        }
    }
</script>
```
* v-model
双向数据绑定
Vue 将数据对象 和DOM进行绑定:
数据的改变会引起DOM的改变
DOM的改变也会引起数据的变化
v-model 
在表单元素上创建双向数据绑定,也可以用于组件 : 
    数据 ---> 页面
    页面 ---> 数据

* v-for
循环渲染数据,可以循环数组,也可以循环对象
```html
<h1 v-for="(item, index) of items" :key="key">{{ item }}</h1>
<h1 v-for="(item, index) in items" :key="key">{{ item }}</h1>

<h1 v-for="(item, key, index) in obj" :key="key">{{ item }}--{{ key }}--{{ index }}</h1>
```
* v-if 和 v-show
条件判断
v-if = "表达式"
v-show = "表达式"
v-if : 根据表达式的值的真假条件渲染元素和移除元素,表达式为false时,元素会真正的被移除. 
v-show : 根据表达式的值的真假条件,切换元素的CSS属性,表达式为 false时, 相当于设置style属性: display:none;
初始页面根据条件判断是否要渲染某一块的组件时,使用v-if ,使用情况: 较少的操作DOM.
频繁的切换组件的显示隐藏,就使用v-show.

## 对象的响应数据变化
只有在data里面声明的数据,才能做响应
data对象中的数据都会被转换成 getter/setter, 所以数据变化时,才会自动更新在页面中.
如果对象中没有定义某个属性,直接通过赋值新增的属性,就不能检测到该属性的变化.
* 直接给对象新增属性,并不能响应化
```js
vm.obj.newattr = 'new msg'
```

* 调用Vue的静态方法set
```js
Vue.set(targetObj, property, value)
```
* 调用实例上的$set方法
```js
this.$set(targetObj, property, value)
```
* 给对象重新赋新的对象
```js
vm.obj = Object.assign({}, vm.obj, {msg: 'new msg'})
```
## 数组的响应数据变化
* 数组的变异方法
vue中提供了观察数组的变异方法,使用这些方法将会触发视图更新push(), pop(),shift(), unshift(), sort(), splice(), reverse(),这些方法会改变原数组.
因为Vue内部对以上七个方法做了一些扩展,使得只有在使用以上方法改变数组时,视图才会更新.
1. 不能触发视图更新的情况
利用索引直接设置一个项时
修改数组的长度时
```js
vm.arr.push(1000)
// 通过下标改变值,并不会让视图更新
vm.list[0] = 'test'
// 使用splice()方法可以改变数组,并且视图会更新数据
vm.list.splice(0,1,"test")
// 改变数组的长度也不能改变视图更新 (如果之后使用了其他的变异方法,会使数组更新,使视图更新)
vm.list.length = 1
```
## 动态绑定class
* v-bind:class= "{classname: 表达式}"
```bash
<div :class="{ red: isRed }"></div>
<div :class="[classA, classB]"></div>
<div :class="[classA, { classB: isB, classC: isC }]">
```
## 动态绑定style
* v-bind:style= "{样式名: 样式值}"
```bash
<!-- style 绑定 -->
<div :style="{ fontSize: size + 'px' }"></div>
<div :style="[styleObjectA, styleObjectB]"></div>
```
## 删除对象的实例属性
* $delete
```js
this.$delete(this.obj, key)
```

## 计算属性Computed
计算属性用于 当模板中 对一个data有过多的逻辑操作时,将其写成函数的形式,在函数内部先进行具体的数据处理,最后再返回.
计算属性写法类似函数,实际上不是函数.
* 计算属性的特点:
1. 可以缓存(当模板中多次使用计算属性时,计算属性只会计算一次,将返回的结果缓存起来,直到有依赖的数据变化时,重新计算.也就是说除了第一次使用computed,会进行计算以外,其他使用computed的值是直接返回的缓存的值,不用再进行计算)
2. 依赖数据的变化,数据变化,计算属性就会重新计算.
* 计算属性的两个操作:
1. 取值(get()), 只有一个函数时,默认就是触发的get()
2. 设置值(set())

* 例子
```js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter, 只有一个函数 默认就是getter
    reversedMessage: function () {
    // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    },
    handleMessage: function () {
    // 取值
        get() {
            return this.message
        },
        set(newVal) {
            this.message = newVal
        }
    }
  }
})
```
## Vue 响应式原理
把一个普通的JavaScript对象传给Vue实例的data选项.Vue将遍历此对象所有的属性, 并用Object.defineProperty把这些属性全部转为getter/setter. Vue内部会对这些数据进行数据劫持操作,进而追踪依赖,在属性被访问和修改时,通知变化.
* 对数据操作时,要先对数据进行劫持(代理)
Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
```js
var dataValue;
Object.defineProperty(data, 'keyName', {
    // 数据描述符
    value: 'hello',     // 设置属性值,默认为undefined
    writable: false,    // 默认为false,不可改写
    enumerable: false,  // 默认为false,不可枚举
    configurable: false, // 默认为false,不可以删除属性
    // 存取描述符 get,set默认为undifined,数据描述符和存取描述符不能混合使用
    // get: function () {
    //     return dataValue
    // },
    // set: function (newVal) {
    //     dataValue = newVal
    // }
}) 
```
* 数据劫持
```js
function Observer(obj) {
    Object.keys(obj).forEach(key => {
        defineReactive(data, key, obj[key])
    })
}
function defineReactive(dataObj, key, value) {
    Object.defineProperty(dataObj, key, {
        get() {
            return value
        },
        set(newVal) {
            // value 在参数中就已经声明了,已经分配了内存空间
            value = newVal
        }
    })
}
```
 ## 声明式渲染
 声明式编程: 只需要声明在哪里做,而无需关心如何实现怎么做的
 ```js
 // 在这里就是声明式,不是知道forEach内部如何实现的.同样的map,reduce,fiter,every,some 都是
 let array = [1,2,3]
 array.forEach((item,index) => {
     array[index] = item + 1 
 })
 ```
 命令式变成: 需要以具体代码表达在哪里做,怎么做 (要描述具体怎么做)
 ```js
 let array = [1,2,3]
 for(let i = 0, i< array.length, i++) {
     array[i] += 1
 }
 ```
 声明式渲染理解:
 1. DOM状态只是数据状态的一个映射
 2. 所有的逻辑尽可能在状态层面去进行
 3. 当数据状态改变了,view视图会被框架自动更新到合理的状态.

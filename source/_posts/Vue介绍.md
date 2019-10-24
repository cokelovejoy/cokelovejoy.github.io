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
    当数据发生变化时 ---> 视图自动更新
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
v------------> vm ------------>model
v<------------ vm <------------model

## vue指令
指令: 是一种特殊的自定义行间属性,以 v-开头
    将数据和DOM关联,当表达式的值改变时,响应式地作用在视图.
    预期的值为javaScript表达式 (表达式是一定会返回值的)
* v-bind v-on
v-bind:msg="message" 绑定属性 , 属性值动态改变
v-on:click="funcHandler" 绑定事件, 事件处理函数的第一个参数是触发事件的DOM中的event对象
                                    event.target: 返回触发此事件的元素.

methods 中的方法中的this 都指向当前组件实例

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
## 对象的响应数据变化
只有在data里面声明的数据,才能做响应
data对象中的数据都会被转换成 getter/setter, 所以数据变化时,才会自动更新在页面中.
如果对象中没有定义某个属性,就不能检测到该属性的变化.
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
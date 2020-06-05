---
title: Vue源码学习思考
date: 2020-06-04 13:57:42
tags:
---

# Vue source code
本章所有内容都是基于Vue 2.6.11版本

在学习Vue 源码之前，我们可以先思考Vue作为前端web框架，给我们提供了什么东西，我们以何种方式去使用Vue，在使用Vue的过程中有哪些值得注意的点（坑）。然后我们可以从这些点思考Vue如何实现这些功能(API)，探究Vue内部的具体实现原理。从整体的层面来考虑Vue，我们应该先思考Vue 做了一些什么事情，或者说是作为一个web框架应该实现的东西。当我们使用一个web框架去实现一个web应用程序的时候，不管使用这个框架时所使用的编程语法多么的复杂或是简单，其内部都应该不可避免的会去实现一些东西，比如编译器，将程序员写的代码(模板)编译成HTML代码，因为浏览器只会将html处理并渲染，并不理解程序员自定义的标签，因此我们可以学习，Vue是如何实现编译器的，如何实现将自定义的标签，属性，指令编译成html代码。然后我们可以思考一下Vue框架的特性，数据响应化，即Vue能够监听对用户定义的状态所做的更改，并对DOM进行响应式的更新。然后学习Vue中各种API具体是如何实现的，通过这一步，可以知道使用Vue的过程中出现一些错误的原因，比如为什么data必须是一个返回对象的函数，为什么获取数据的最早时机只能是在created生命周期函数钩子中。同时我们通过学习源码，能知道Vue内部一些代码的执行时机。综上所述，我们在学习完源码之后，应该可以知道如何以最佳方式去使用Vue，避免在使用Vue的时候出现一些迷惑性的操作，以及对出现的问题，能够很好的追根溯源。

总结 我们应该学习以下要点：
1. Vue 构造函数 实现的完整流程。
2. Vue 数据响应化处理包括(object, array)，这里有监听器(Watcher class),依赖收集(Dep class).还涉及到了发布订阅模式的使用。
3. Vue 如何实现模板编译(compile), 这里有虚拟DOM(Vnode class)，抽象语法树(AST)。
4. Vue 具体如何实现这些API，$nextTick(), forceUpdate(), setData()。
5. Vue 中使用到的设计模式，比如发布订阅模式，混入模式等。
6. Vue 中可以实现的对于数据类型的判断的(object, null, undefined)，以及数据转换的实现(toString, toNumber)

## How to start
首先我们需要获取Vue源码
Vue源码地址： https:/github.com/vuejs/vue
当前版本： 2.6.10
1. 获取源码
```bash
git clone https:/github.com/vuejs/vue
```
2. 配置调试环境
```bash
# 进入vue源文件，下载依赖
npm install

# 安装rollup(专门用于js代码的打包工具)
npm install -g rollup
```
3. 修改package.json
在scripts > dev 下添加 --sourcemap
指明配置文件所在目录： -c scripts/config.js 
```bash
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
```
4. 启动命令
当运行命令后会生成对应打包后的vue.js文件，在/dist目录下。
vue各版本： vue.runtime.common.js 用于webpack 1.x， browserify。vue.runtime.esm.js用于webpack 2.x。
```bash
npm run dev
```
5. 新建html文件用于浏览器调试
新建 /examples/test/test.html
```js
// 引入vue.js 创建Vue实例
<script src="/dist/vue.js"></script>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
            msg1:'hello vue',
            msg2: 'coke'
        },
    })
</script>
```
6. 源码入口文件
我们学习的是打包后生成的带编译器的vue.js文件。
所以源码学习从入口文件从 /src/platforms/web/entry-runtime-with-compiler.js开始。
```js
{
    // Runtime+compiler development build (Browser)
    'web-full-dev': {
        entry: resolve('web/entry-runtime-with-compiler.js'), // webpack打包的入口文件
        dest: resolve('dist/vue.js'), // webpack打包生成的目标文件的位置
        format: 'umd', // 输出规范
        env: 'development',
        alias: { he: './entity-decoder' },
        banner
    },
}
```
## Vue Constructor Function
经过以上步骤，我们已经知道了从哪一个文件开始分析vue源码，但是我这里不从最外层一层一层开始分析，因为我已经整理过，下图是我自己总结的Vue构造函数的简单的整体结构是什么样子的，所以我直接从Vue源码最底层开始讲起，分析Vue是如何从最初的构造函数一步步壮大的。更详细的Vue源码分析的思维导图，请查看地址：https://www.processon.com/view/link/5ed8b1df5653bb445ce4a8ba。

<img src="/static/img/VueCorFunc.png">
首先会有一个简单的Vue构造函数，我称之为Basic Vue，在这里这仅仅是一个简单的构造函数，其内部只有一个_init()方法的调用，也就是当我们写new Vue({xxx})的时候，会去执行到_init这个方法。看到这里你可能会问_init是在哪里定义的，继续往下看，我们会看到initMixin(Vue)这个方法的调用，也就是在这个方法中，我们可以看到给Vue的实例绑定了一个_init()方法。

```js
function Vue(options) {
    this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```

---
title: vue-router
date: 2019-10-15 14:35:56
tags:
---
概述: 如何使用vue-router以及如何实现简版的vue-router.
vue-router为了实现单页面应用，在浏览器地址栏变化时，去修改url history栈，去实现切换页面，并且不用发送请求。
## vue-router使用
### 安装:
前提使用vue-cli创建的项目,才能使用vue 命令
```bash
vue add router
```
### 配置router.js
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

// 应用插件：做了什么？ install
// install里面做了什么？
// 1.挂在$router
// 2.注册组件 router-link 和router-view
// router做了什么？
// 1.解析路由配置
// 2.响应url变化
// 3.事件监听hashchange
// 4.组件切换？怎么切换？
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
  ]
})
```
### 在main.js 中添加到vue选项
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
    router, //为什么挂载 ? 为了全局使用，成为Vue实例的options属性下的属性-$router
    render: h => h(App)
}).$mount('#app')
```

### 导航链接
使用 router-link 组件来导航.
通过传入 `to` 属性指定链接.
router-link 默认会被渲染成一个 `<a>` 标签
```html
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>
```

### 路由出口
路由匹配到的组件将渲染在这里
```html
<router-view/>
```
### 动态路由
把某种模式匹配到的所有路由, 全部映射到同一个组件
* 创建Detail.vue
```html
<template>
    <div>
        <h2>商品详情</h2>
        <p>{{ $route.params.id }}<p>
    </div>
</template>
```
* 为组件Detail.vue配置路由, router.js
```js
export default {
    path: '/detail/:id',
    name: 'detial',
    component: Detail
}
```
* 路由跳转, Home.vue
```html
<div v-for="item in items" :key="item.id">
    <router-link :to="`/detail/${item.id}`">{{ item.name }}</router-link>
</div>
```
### 路由嵌套
* 路由配置 router.js
```js
export default {
    path: '/',
    name: 'home',
    component: Home,
    children: [{
        path: '/detail/:id',
        name: 'detail',
        component: Detail
    }]
}
```
* 在Home.vue 添加 router-view, 子组件将来就会填充在此 (占位)
路由嵌套了多少个子路由,就有多少个router-view 占位, 子路由里面还有子路由,对应的router-view里也有router-view占位.

``` html
<template>
    <div class="home">
        <h1>首页</h1>
        <router-view></router-view>
    </div>
</template>
```
## 实现自己的vue-router
* 思路: router做了什么?
1. 解析路由配置对象,生成map
2. 响应url变化
3. 事件监听hashchange
4. 组件切换? 怎么切换?

### 创建一个VueRouter类
创建zvue-router.js
```js
// 实现 自己的VueRouter类
// 需要实现的 功能
// 1.解析routes配置:生成map对象，{'/': Home, '/about': About}
// 2.响应url变化
// 3.事件监听hashchange
// 4.组件切换

let Vue
// 声明Router类
export default class ZVueRouter {
    // 1.解析route配置,生成routeMap对象(指定路由映射指定的组件)
    constructor(options) {
        this.$options = options
        // 路由映射表对象 用来保存 路由 和 路由指定的组件
        this.routeMap = {}

        // url响应化处理: 只要url变化, 用到url 的组件就会重新渲染
        // vue-router 跟vue强耦合 ,因此这个插件只能用于vue, current保存当前hash,vue使其是响应式的
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }
    // 声明初始化函数
    init() {
        // 1. 事件监听
        this.bindEvents()
        // 2. 路由映射操作
        this.createRouteMap()
        // 3. 组件声明和注册
        this.initComponent()
    }
    // 监听hashchange事件, 当hash值改变时,就会触发事件,然后执行回调函数,将改变当前我们保存的路由的hash值.
    bindEvents() {
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))
    }
    onHashChange() {
        // #/index
        this.app.current = window.location.hash.slice(1) || '/'
    }
    // 做路由映射
    // 源码中是递归遍历，因为有嵌套路由
    createRouteMap() {
        this.$options.routes.forEach(item => {
            this.routeMap[item.path] = item
        })
    }
    // 初始化组件    
    initComponent() {
        // 函数式声明组件
        // 声明 组件 <router-link>
        // <router-link to="/">abc</router-link> 
        Vue.component('router-link', {
            props: {
                to: String
            },
            // render选项
            // h(tag, data, children)
            render(h) {
                // 此处的this 是当前组件的实例
                return h('a', {attrs: {href: '#' + this.to}}, [this.$slots.default])
            }
        })
        // <router-view>
        // 路由出口, 将来组件会插在此处
        Vue.component('router-view', {
            render: (h) => {
                // 拿出要渲染的组件
                // this 希望是ZVueRouter实例
                const component = this.routeMap[this.app.current].component
                return h(component)
            }
        })
    }
}

// 实现插件
// 插件接受Vue构造函数
ZVueRouter.install = function (_Vue) {
    // 保存Vue构造函数,就可以方便使用了.
    Vue = _Vue
    // 混入: 执行挂载操作
    Vue.mixin({
        beforeCreate() {
            // 确保是根组件时执行一次, 将router实例放到Vue原型上,以后所有vue组件实例就都有$router
            if (this.$options.router) {
                // 这里的this 是vue实例 
                Vue.prototype.$router = this.$options.router
                // 执行初始化
                this.$options.router.init()
            }
        }
    })
}
```

### 创建路由配置文件zrouter.js, 使用自定义路由

```js
import Vue from 'vue'
import ZVueRouter from './zvue-router.js'
import Home from './views/Home.vue'
import About from './views/About.vue'

// Vue.use() 应用插件, 里面会调用一个install 方法
// install 方法里面会:
// 1. 挂载$router
// 2. 生命$route
// 3. 注册组件
Vue.use(ZVueRouter)
export default new ZVueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: "/about",
            name: 'about',
            component: About
        }
    ]
})
```
### 在main.js 里引入路由配置zrouter.js, 并写入选项
```js
import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// 导入自己的路由配置文件
import router from './zrouter.js'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

```


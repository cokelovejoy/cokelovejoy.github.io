---
title: vue-router
date: 2019-10-15 14:35:56
tags:
---
概述: 如何使用vue-router以及如何实现简版的vue-router.

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
    router, //为什么挂载 ? 全局使用
    render: h => h(App)
}).$mount('#app')
```

### 导航链接
使用 router-link 组件来导航.
通过传入 `to` 属性指定链接.
<router-link> 默认会被渲染成一个 `<a>` 标签
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
首先思考几个问题: 在router.js中
* 应用插件Vue.use(Router): 做了什么? install里面做了什么?
1. 挂载$router
2. 注册组件(router-link, router-view)

* router做了什么?
1. 解析路由配置对象,生成map
2. 响应url变化
3. 事件监听hashchange
4. 组件切换? 怎么切换?

### 创建一个VueRouter类
创建zvue-router.js
```
class
```

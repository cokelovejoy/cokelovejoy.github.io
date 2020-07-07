---
title: Vuex状态管理
date: 2019-10-21 09:49:37
tags:
---

Vuex 是一个专为Vue.js应用开发的状态管理模式,集中式存储管理应用所有组件的状态.
Vuex遵循"单向数据流"理念,易于问题追踪以及提高代码可维护性.

## 安装 vuex
```bash
vue add vuex
```

## 核心概念
* state 状态，数据
* mutations更改状态的函数
* actions异步操作
* store包含以上概念的容器

## 状态和状态变更
通常 Vuex的内容写成模块化的方式: /src/vuex/modules /src/vuex/store.js
1. 新建一个文件夹vuex
2. vuex 文件夹下 新建一个文件夹modules,用来存放一个个单独的store配置文件
3. vuex 文件夹下 新建 store.js, 用于创建Vuex.Store实例.

* 在modules文件夹下新建 add.js
```js
// state保存数据状态
const state = {
    count: 0,
    left: 10
}
// mutations用于修改状态
const mutations = {
    increment(state) {
        state.count += 1
        state.left -= 1
    }
}
// 从state派生出新状态,类似计算属性
const getters = {
    getCount(state) {
        return state.count
    },
    left(state) {
        return state.left
    }
}
// 动作- actions
// 复杂业务逻辑 或者 调用api请求服务器 获取数据,然后通过commmit保存到state.
// actions内部函数执行同步代码返回的结果依然是promise
const actions = {
    asyncAdd({commit}){
        commit("increment");
    },
    increment({getters, commit}) {
        // 添加业务逻辑
        if (getters.left > 0) {
            commit("increment")
            return true
        }
        return false
    },
    asyncIncrement({ dispatch }) {
        // 异步逻辑返回Promise
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(dispatch("increment"))
            }, 1000)
        })
    }
}
// 将整个对象返回
// namespaced 使用命名空间
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

```
* store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import add from './modules/add.js'

Vue.use(Vuex)
// 以模块的方式 写入
export default new Vuex.Store({
 modules: {
   add: add
 }
})

```
* main.js 
```js
import Vue from 'vue'
import App from './App.vue'

import store from './vuex/store.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

* 在组件中使用store中的state, commit, dispatch, getters
```html
<template>
  <div class="home">
    <div>手榴弹扔了{{ $store.state.add.count }} 个</div>
    <button @click="add">扔一个</button>
    <button @click="asyncAdd">蓄力扔一个</button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    add() {
      this.$store.commit("add/increment")
      // 即使action执行同步代码返回的结果依然是Promsie对象
      // this.$store.dispatch("add/increment").then(res => {
      //   if (!res) {
      //     alert("投掷失败! 没货了")
      //   }
      // })
    },
    asyncAdd() {
      this.$store.dispatch("add/asyncAdd")
      // this.$store.dispatch("add/asyncIncrement").then(res => {
      //   if (!res) {
      //     alert("投掷失败! 没货了")
      //   }
      // })
    }
  }
}
</script>
```

## 实现自己的Vuex
实现Store类
1. state响应化处理
2. 保存状态，实现dispatch，commit，getters
实现插件
1. 挂载store实例

* 创建 zvuex.js
```js
// 自定义vuex
// vuex 内最重要的是实现两个方法commit 方法和 dispatch方法
// 1. 插件
let Vue
function install(_Vue) {
    Vue = _Vue
    // 混入 store, 混入的作用: 让它至少会执行一次
    // store 执行的时候就有Vue,不用import
    // 这也是为什么Vue.use必须在新建store之前
    Vue.mixin({
        beforeCreate() {
            // 这样才能获取到传递进来的store
            // 只有root元素才有store, 所以判断一下
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}
// 2. 实现Store
class Store {
    constructor(options = {}) {
        this.state = new Vue({
            data: options.state
        })
        this.mutations = options.mutations || {}
        this.actions = options.actions || {}
    }
    // func 是mutations中的函数名
    // 注意这里用箭头函数形式, 后面actions实现时会有作用
    commit = (func, arg) => {
        this.mutations[func](this.state, arg)
    }

    dispatch(func, arg) {
        this.actions[func]({
            commit: this.commit,
            state: this.state,
        }, arg)
    }
}
export default { Store, install }
```
* 使用自定义的vuex
```js
// 使用自定义的vuex
// 这个文件 其实就是一个 配置文件的东西, 将一个对象作为参数传入Vuex的Store类中,创建一个Store实例.
import Vue from 'vue'
import Zvuex from './zvuex.js'

Vue.use(Zvuex)

export default new Zvuex.Store({
    state: {
        count: 0,
        left: 10
    },
    mutations: {
        increment(state) {
            state.count += 1
            state.left -= 1
        }
    },
    getters: {
        getCount(state) {
            return state.count
        },
        left(state) {
            return state.left
        }
    },
    actions: {
        asyncAdd({commit}){
            commit("increment");
        },
        increment({getters, commit}) {
            // 添加业务逻辑
            if (getters.left > 0) {
                commit("increment")
                return true
            }
            return false
        },
        asyncIncrement({ dispatch }) {
            // 异步逻辑返回Promise
            return new Promise(resolve => {
                setTimeout(() => {
                    // 使用其他的 action
                    resolve(dispatch("increment"))
                }, 1000)
            })
        }
    }
})

```
* main.js
```js
import Vue from 'vue'
import App from './App.vue'
// 导入自己的store配置文件
import store from './zstore.js'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

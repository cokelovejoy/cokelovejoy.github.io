---
title: vue 面试题
date: 2020-08-08 15:47:54
tags:
---


# v-if 和v-for哪个优先级更高？如果同时出现，应该怎么优化得到更好的性能？

源码位置:compiler/codegen/index.js
答案：
1. v-for优先于v-if被解析，在源码中模板编译的时候，for先于if处理。并且在最终生成渲染函数时，_l()代表v-for循环，其中包括了v-if的判断。所以最终的效果就是v-if的条件判断被包裹在v-for中。
2. 如果同时出现，每次渲染都会执行循环再判断条件，无论如何循环都不可避免，浪费了性能。
3. 要避免这种情况的出现，需要在外层嵌套template，并且使用v-if的判断，然后在内部进行v-for循环。
4. 优化：使用computed选项，进行筛选之后，只需要渲染需要显示的数据，不需要再做判断了。

# Vue组件data为什么必须是一个函数，而Vue根实例则没有此限制？
源码位置：src/core/instance/state.js - initData()
答案：
1. Vue组件可能存在多个实例，如果在使用对象形式定义data，则会导致他们共用一个data对象，那么状态变更将会影响所有组件实例，这是不合理的；
2. 采用函数形式定义data，在intitData时，会将其作为工厂函数返回全新data对象，有效规避多实例之间状态污染的问题。而在Vue根实例创建的过程中则不存在该限制，也是因为为根实例只能有一个，不需要担心这种情况。
3. 在源码中，在vue组件创建和vue根实例创建时，进入的是不同的处理分支。vue根实例mergeData的时候会传入vm参数，vue组件不会传入vm参数，以此来区分。在vue组件创建过程中，对data选项合并时，当data选项不是function时，就会报错。

# vue中key的作用和工作原理？
src/core/vdom/patch.js - updateChildren()
答案：
1. key的作用主要是为了高效更新虚拟DOM，其原理是vue在patch过程中通过key可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使得整个pathch过程更加高效，较少DOM操作两量，提高性能。
2. 另外，如果不设置key可能在列表更新时引发一些隐蔽的bug。
3. vue中在使用相同标签名元素的过度切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过度效果。

# 怎么理解vue中diff算法？
源码位置：
1. 必要性，lifecycle.js-mountComponent()
组件中可能存在很多个data中的key的使用。
2. 执行方式，patch.js-patchVnode()
patchVnode时diff发生的地方，整体策略：深度优先，同层比较。
3. 高效性，patch.js-updateChildren()

答案：
1. diff算法时虚拟DOM技术的必然产物：通过新旧虚拟DOM作对比(即diff)，将变化的地方 更新在真实DOM上。另外，也需要diff高效的执行对比过程。从而降低时间复杂度O(n)。
2. Vue2.x中为了降低Watcher粒度，每个组件创建时，只有一个Watcher与之对应，只有引入diff才能精确找到发生变化的地方。
3. vue中diff执行的时刻是组件实例执行其更新函数时，它会比对上一次渲染结果oldVnode和新的渲染结果newVnode，此过程称为patch。
4. diff过程整体遵循深度优先，同层比较的策略；两个节点之间比较会根据它们是否拥有子节点或者文本节点做不同操作；比较两组子节点是算法的重点，首先假设头尾节点可能是相同，做4次对比尝试，如果没有找到相同节点才按照通用方式遍历查找，查找结束再按情况处理剩下的节点；借助key通常可以非常精确找到相同节点，因此整个patch过程非常高效。

# 谈一谈vue组件化的理解
组件化定义，优点，使用场景和注意事项等方面展开陈述，同时要强调vue中组件化的一些特点。

源码位置：
1. 组件定义 src/core/global-api/assets.js
对于单文件组件中的template标签，vue-loader会编译template为render函数，最终导出的依然是组件配置对象。
2. 组件化优点 src/core/instance/lifecycle.js - mountComponent()
组件，Watcher，渲染函数和更新函数之间的关系。
3. 组件化实现 
构造函数 src/core/global-api/extend.js
实例化及挂载 src/core/vdom/patch.js - createElm()

总结
1. 组件是独立和可复用的代码组织单元。组件系统是Vue核心特性之一，它使开发者使用小型，独立和可复用的组件构建大型应用；
2. 组件化开发能大幅度提高应用的开发效率，测试性，复用性等；
3. 组件使用按分类有：页面组件，业务组件，通用组件；
4. vue的组件是基于配置的，我们通常编写的组件是组件配置，而非组件，框架后续会生成其构造函数，它们基于VueComponent类，继承自Vue。
5. vue中常见的组件化技术有：属性prop，自定义事件，插槽，它们主要用于组件通信，扩展等。
6. 合理的划分组件，有助于提升应用性能。
7. 组件应该是高内聚，低耦合的。
8. 遵循单向数据流的原则。

# 谈一谈对vue设计原则的理解？
1. 渐进式JavaScript框架
与其他大型框架不同的是，Vue被设计为可以自底向上逐层应用。Vue的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue也完全能够为复杂的单页面应用提供驱动。

2. 易用，灵活和高效
易用性： vue提供数据响应式，声明式模板语法和基于配置的组件系统等核心特性。这些使我们只需要关注应用的核心业务即可，只要会写js，html和css就能轻松编写vue应用。

灵活性：渐进式框架的最大有点就是灵活性，如果应用足够小，我们可能仅需要vue核心特性即可完成功能；随着应用规模的不断扩大，我们才可能组件引入路由，状态管理，vue-cli等库和工具，不管是应用体积还是学习难度都是一个组件增加的平和曲线。

高效性： 超快的虚拟DOM和Diff算法使我们的应用拥有最佳的性能表现。追求高效的过程还在继续，vue3中引入Proxy对数据响应式改进以及编译器中对于静态内容编译的改进都会让vue更加高效。
# Vue为什么要求组件模板只能有一个根元素
从以下方面考虑：
## 单文件组件中，template下的元素div。其实就是'树'状数据结构中的根。
在webpack搭建的vue开发环境下，使用单文件组件时：
```html
<template>
    <div></div>
</template>
```
template是html5的新标签，有三个特性：
1. 隐藏性： 该标签不会显示在页面的任何地方，即便里面有多少内容，它永远都是隐藏的状态，设置了display：none
2. 任意性： 该标签可以写在任何地方，甚至是head，body，script标签内。
3. 无效性： 该标签里的任何HTML内容都是无效的不会起任何作用；只能通过innerHTML来获取里面的内容。

一个vue单文件组件就是一个vue实例，为了让组件可以正常生成一个vue实例，这个div会自然的处理成程序的入口，通过这个根节点，来递归遍历整个vue树下的所有节点，并处理为vdom，最后在渲染成真正的HTML，插入在正确的位置。
## diff算法要求的，源码中patch.js里patchVnode()
diff中patchVnode方法，用来比较新旧结点
# 谈谈对MVC，MVP和MVVM的理解
1. 这三者都是框架模式，它们设计的目标都是为了解决Model和View的耦合问题。
2. MVC模式出现较早主要应用在后端，如Spring MVC、ASP.NET MVC等，在前端领域的早期也有应 用，如Backbone.js。它的优点是分层清晰，缺点是数据流混乱，灵活性带来的维护性问题。
3. MVP模式在是MVC的进化形式，Presenter作为中间层负责MV通信，解决了两者耦合问题，但P层 过于臃肿会导致维护问题。 
4. MVVM模式在前端领域有广泛应用，它不仅解决MV耦合问题，还同时解决了维护两者映射关系的 大量繁杂代码和DOM操作代码，在提高开发效率、可读性同时还保持了优越的性能表现.
M-model - 保存应用数据
V-view - 视图，展示数据
C-controller - 业务逻辑，修改数据
VM- ViewModel -通过DOM listener监听响应View中用户交互,修改Model中数据。
ViewModel通过实现一套数据响应式机制自动响应Model中数据变化； 同时ViewModel会实现一套更新策略自动将数据变化转换为视图更新。

#  你了解哪些Vue性能优化方法？
主要探讨Vue代码层面的优化。
1. 路由懒加载
```js
const router = new VueRouter({
    routes: [
        { path: '/foo', component: () => import('./Foo.vue')}
    ]
})
```
2. keep-alive缓存页面
```html
<template>
    <div id="app">
        <keep-alive include="xxx">
           <router-view/> 
        </keep-alive> 
    </div>
</template>
```
3. 使用v-show复用DOM
对于经常切换的组件，使用v-show。

4. v-for遍历避免同时使用v-if。

5. 长列表性能优化
对于纯粹是数据展示的列表，就不需要做响应化。
```js
export default {
    data: () => ({
        users: []
    }),
    async created() {
        cosnt users = await axios.get("/api/users")
        this.users = Object.freeze(users)
    }
}
```
6. 如果是大数据长列表，可以采用虚拟滚动，只渲染少部分区域的内容。
参考：vue-virtual-scroller , vue-virtual-scroll-list
```html
<recycle-scroller class="items" :items="items" :item-size="24"> 
    <template v-slot="{ item }">    
        <FetchItemView :item="item" @vote="voteItem(item)"/> 
    </template
</recycle-scroller>
```

7. 事件销毁
Vue组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。
```js
created() {  
    this.timer = setInterval(this.refresh, 2000)
},
beforeDestroy() {  
   clearInterval(this.timer) 
}
```
8. 图片懒加载
对于图片过多的页面，为了加速页面加载速度，所以很多时候需要将页面内未出现在可试区域内的图片先不做均价在，等到滚动到可视区域后再去加载。
参考：vue-lazyload
```html
<img v-lazy="/statix/img/1.png">
```
9. 第三方插件按需引入
像element-ui这样的第三方组件可以按需引入避免体积太大。
```js
import Vue from 'vue';
import { Button, Select } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
```
10. 无状态的组件标记为函数式组件
组件只做展示，没有业务逻辑，就可以标记为函数式组件
```js
<template functional>
    <div class="cell">
        <div v-if="props.value" class="on"></div>
        <section v-else class="off"></section>
    </div> 
</template>
<script>
export default {  props: ['value'] }
</script>
```
11. 子组件分割
```js
<template>
    <div>
        <ChildComp/>
    </div>
</template>
<script>
export default {  
    components: {    
        ChildComp: {      
            methods: {        
                heavy () { /* 耗时任务 */ }      
            },
            render (h) {   
                return h('div', this.heavy())     
            }
        }
    }
}
</script>
```

12. 变量本地化
```js
cosnt base = this.base // 避免频繁的引用this.base
```

13. 在computed中将数据处理完之后，直接去渲染，减少v-if的条件判断。
14. SSR服务端渲染
优点：加快首屏渲染的速度，有利于seo
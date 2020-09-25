---
title: vue 面试题
date: 2020-08-08 15:47:54
tags:
---

# v-if
v-if 的值从false 变为true，会重新触发组件的生命周期函数。
# props属性
通过props属性传递的值不能够改变，可以通过computed的get和set去包裹一层。
# computed属性
computed属性在mounted之前操作，因此不能在computed里面获取到dom元素。

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
优点：加快首屏渲染的速度，有利于seo。

# Vue 3.0新特性
Vue3.0 的改进主要在以下几点：
## 更快： 
### 虚拟DOM重写
期待更多的编译时提示来减少运行时开销，使用更有效的代码来创建虚拟节点。
组件快速路径+单个调用+ 子节点类型检测
* 跳过不必要的条件分支
* JS引擎更容易优化
### 优化slots的生成
Vue 3中可以单独重新渲染父级和子级
* 确保实例正确的跟踪依赖关系
* 避免不必要的父子组件重新渲染
### 静态树提升
使用静态树提升，这意味着Vue 3的编译器将能检测到什么是静态的，然后将其提升，从而降低了渲染成本。
* 跳过修补整棵树，从而降低渲染成本
* 即使多次出现也能正常工作
### 静态属性提升
使用静态属性提升，Vue 3打补丁时将跳过这些属性不会改变的节点。
### 基于Proxy的响应式系统
Vue 2的响应式系统使用Object.defineProperty的getter和setter。Vue 3将使用ES6 Proxy作为其观察机制，这将带来如下改变：
* 组件实例初始化的速度提高1倍。
* 使用Proxy内存开销节省一半，加快速度，但是存在低版本浏览器的不兼容。
* 为了继续支持IE11,Vue 3将发布一个支持旧观察者和新Proxy版本的构建。
## 更小
通过摇树优化核心库体积
## 更容易维护
Vue 3 将带来更可维护的源代码。它不仅会使用 TypeScript，而且许多包被解耦，更加模块化。
## 更加友好
跨平台，编译器核心和运行时核心与平台无关，使得 Vue 更容易与任何平台(web, android, ios)一起使用。
## 更容易使用
1. 改进的TypeScript支持，编辑器能提供强有力的类型检查，错误和警告。
2. 更好的调试支持
3. 独立的响应化模块
4. composition API

# Vuex使用及其理解
vue中的状态管理，使用场景：登陆验证，购物车，播放器等。
## Vuex介绍
Vuex数据流程：通过actions 异步请求数据，mutations修改state，getter类似computed获取state的值。
## Vuex 核心概念
state：vuex的唯一数据来源，获取多个state，可以使用...mapState()。
getters：getter理解为computed，getter的返回值根据他的依赖缓存起来，依赖发生变化才被重新计算，辅助函数...mapGetter()。
mutations: 更改state中唯一的途径。只能是同步操作。通过$store.commit提交,辅助函数...mapMutations()。
actions： 获取异步数据的地方。通过$store.dispatch触发，辅助函数...mapActions()。
module：模块化。

## Vuex中数据存储
vuex是vue的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新之后就回到了初始状态，具体做法应该在vuex里数据改变的时候把数据拷贝一份保存到localStorage里面，刷新之后，如果localStorage里有保存数据，取出来再替换store里的state。

注意：localStorage存储数据的格式都是以字符串的形式来存储的，需要使用JSON.parse(localStorage.getItem("userInfo"))解析。
```js
let defaultCity = "上海"
try {    // 用户关闭了本地存储功能，此时在外层加个try...catch  
    if (!defaultCity) {      
        defaultCity = JSON.parse(window.localStorage.getItem('defaultCity'))
    }
} catch (e) {
    console.log(e)
}
// vuex
export default new Vuex.Store(
    {
        state: { city: defaultCity },
        mutations: {
            changeCity(state, city) {
                state.city = city
                try {
                    window.localStorage.setItem('defaultCity', JSON.stringify(state.city));      // 数据改变的时候把数据拷贝一份保存到localStorage里面      
                } catch (e) { 
                    console.log(e)
                }
            }
        }
    }
)
```
总结： 
1. 首先说明Vuex是一个专门为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
2. vuex核心概念：mutations，actions介绍
3. vuex如何做数据存储： 配合localStorage

# Vue中组件之间的通信方式
组件可以有以下几种关系：
1. 父子关系
2. 兄弟关系
3. 隔代关系

##  常见使用场景
### 父子组件通信
#### props 和 $emit/$on 
在父组件中给子组件绑定属性，子组件声明props，将数据从父组件传递到子组件。
在父组件中给子组件绑定自定义事件，子组件通过$emit触发自定义事件，以参数的形式，将数据传递到父组件。

#### $parent/$children 与 ref/$refs
ref属性： 如果设置在DOM上引用指向DOM元素，在子组件上使用，引用就指向组件实例。设置ref属性，通过$refs获取数据。
$parent和$children: 直接获取父/子组件实例。

注意：这两种方式都不可以跨级以及兄弟之间通信。
### 兄弟组件通信
兄弟组件通信的方式，通过vuex，以父组件做中间层使用自定义事件绑定emit/on，以及事件总线。
### 跨层组件通信
#### vuex
多层级嵌套需要传递数据可以使用 vuex，一次存储，所有页面都可访问。
#### $attrs / $listeners
$attrs: 包含了父组件给子组件绑定的，并且没有在子组件props中声明的自定义属性(class和style除外)。同时可以通过v-bind="$attrs"传入到内部组件。

$listeners: 包含了父组件给子组件绑定的自定义事件(不含native修饰的事件)。它可以通过v-on="listeners"传入到内部组件。

#### provide/inject 选项
祖先组件中通过provide来提供变量，然后在子孙组件中通过inject来注入变量。

provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

注意：provide/inject传递的数据并不是可响应的，但如果传入的数据本身是响应的对象，那么其对象的属性还是可响应的。

provide/inject如何实现数据响应式
1. provide祖先组件的实例，然后在子孙组件中注入依赖，这样就可以在子孙组件中直接修改祖先组件的实例的属性。缺点：实例上挂载很多没必要的东西。

```js
<div>
    <h1>A组件</h1>
    <child-b></child-b>
    <child-c></child-c>
</div>

data() {
    return {
        color: "blue"
    }
},
// 这种方式绑定的数据并不是可响应的
// provide() {
//     return {
//         theme: {
//             color: this.color
//         }
//     }
// }
provide() {
    return {
        theme: this // 方法1：提供祖先组件的实例
    }
},
methods: {
    changeColor() {
        // changde color
    }
}
```
2. 推荐使用Vue.observable优化provide。
```js
// 方法2： 使用Vue.observable 优化响应式provide
provide() {
    this.theme = Vue.observable({
        color: "blue"
    })
    return {
        theme: this.theme
    }
}
// 在组件中使用

<template>
    <div>
        <h1 :style="{color: injections.theme.color}"> xx</h1>
    </div>
</template>
export default{
    inject: {
        theme: {
            default: () => ({}) // 函数式组件取值
        }
    }
}
```
#### $bus
使用vue实例作为事件总线，用来触发事件和监听事件，通过这种方式可以进行组件通信包括：父子，兄弟，跨级。
```js
// bus.js
import Vue from 'vue'
export default new Vue()
// 监听事件 组件a
import bus from './bus'

bus.$on('sendTitle', (val) => {
    this.value = val
})

// 触发事件 组件b
import bus from './bus'

bus.$emit('sendTitle', 'value')
```

# Vue-router中的导航钩子有哪些？
1. 全局的钩子函数
beforeEach(to, from, next) 路由改变前调用，常用于验证权限。
afterEach(to, from) 路由改变后的钩子，常用自动让页面返回最顶端。

2. 路由配置中的导航钩子
beforeEnter(to, from, next)

3. 组件内的钩子函数
beforeRouteEnter(to, from, next),该组件的对应路由被comfirm前调用，此时实例还没被创建，所以不能获取实例(this)。
beforeRouteUpdate(to, from, next),当前路由改变，但是该组件被复用时调用，该函数内可以访问组件实例this。
beforeRouteLeave(to, from, next),当导航离开组件的对应路由时调用，该函数内可以访问获取组件实例。

4. 路由监测变化
监听到路由对象发生变化，从而对路由变化做出响应。
```js
{
    watch:{
        $route: {
            handler: function(val, oldVal){
                console.log(val);
            },
            // 深度观察监听
            deep: true
        }
    } 
}
```
总结： 
1. 路由中的导航钩子有三种：全局，组件，路由配置
2. 在做页面登陆权限的时候可以使用到路由导航配置。
3. 监听路由变化

# 递归组件
概念： 组件是可以在他们自己的模板中调用自身的。
条件： 数据是满足递归条件，树状的递归数据结构。一定要设置递归组件的结束条件。
场景： 多层级目录。

总结：通过props从父组件拿到数据，递归组件每次进行递归的时候都会tree-menus组件传递下一级treeList数据，整个过程结束之后，递归也就完成了，对于折叠树状菜单来说，我们一般只会去渲染一级的数据，当点击一级菜单时，再去渲染一级菜单下的结构，如此往复。那么v-if就可以实现我们的这个需求，当v-if设置为false时，递归组件将不会再进行渲染，设置为true时，继续渲染。

# vue响应式理解
响应式实现：Object.defineProperty , proxy(ES6)
## Observe类
对data选项Observe，分别对对象和数组做响应化处理。
对对象采用Object.defineProperty设置getter和setter的方式，这种方式称为数据劫持。
对数组采用扩展数组的7个变异方法，然后当数组改变的时候就会，通知更新。
## Dep类
一个key 就会为之生成一个dep实例来管理依赖，依赖就是使用到了数据的地方，本质就是watcher。
当数据在页面上渲染的时候，就会通过getter函数来收集依赖到dep实例的subs数组下。
## Watcher 类
当一个组件mount的时候，就会生成一个render watcher实例。
当数据变化时，会触发setter函数去通知watcher，watcher再去通知异步任务队列，执行异步更新。

# vue如何扩展组件
1. 使用混入mixin
混入(mixin)是一种分发Vue组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

mixins的调用顺序：全局混入的钩子函数 > 组件内的混入的钩子函数 > 组件自身的钩子。
选项合并： 组件和混入对象的同名选项递归合并，冲突以组件数据优先。
```js
// 组件内的混入：mixins选项接受一个混合对象的数组。
{
    mixins:[xxx]
}
// 全局混入：使用Vue.mixin 全局注册一个混入， 影响每个vue实例
Vue.mixin({xxx})
```

2. slot扩展组件
默认插槽，匿名插槽，具名插槽

# watch和computed的区别以及怎么选用？
原理：
计算属性computed底层实现本质是watch，但是实现了缓存。
使用场景不一样：
watch：需要在数据变化时，去执行异步操作或开销比较大的操作的时候使用。例如搜索数据。
computed：一个数据属性受多个属性影响的时候。例如：购物车商品结算。

# nextTick原理
使用nextTick的场景： Vue不推荐操作DOM,但有时候不得不在修改数据后，获取DOM状态或者不得不操作DOM时。在数据变化之后立即使用 Vue.nextTick(callback)是为了在数据变化之后等待 Vue 完成更新DOM。这样回调函数将在 DOM 更新完成后被调用，因此可以在回调函数中获取到最新的DOM。

为什么要使用nextTick： Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

## vue如何监听到DOM更新完毕
能监听到DOM改动的API：MutationObserver。
MutationObserver是HTML5新增属性，用于监听DOM修改事件，能够监听到节点的属性，文本内容，子节点的改动。
```js
// MutationObserver
const observer = new MutationObserver(function () {
    console.log('DOM 被修改了')
})
const article = document.querySelector('article')
observer.observer(article)
```
Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

Vue的处理思路就是将nextTick里面的代码放在UI render 之后执行，就能访问到最新的ODM。Vue并不是使用MutationObserver做DOM变化监听，而是用队列控制的方式达到目的。

## Vue如何进行队列控制
因为macrotask总是要等到microtask都执行完之后再执行，因此利用microtask这一特性，是做队列控制的最佳选择。

vue进行DOM更新内部也是调用nextTick来做异步队列控制。而当我们自己调用nextTick的时候,它就在更新DOM的那个microtask后追加了我们自己的回调函数,从而确保我们的代码在DOM更新后执行,同时也避免了setTimeout可能存在的多次执行问题。

常见的microtask有：Promise，MutationObserver，以及nodejs中的process.nextTick。

看到了MutationObserver,vue用MutationObserver是想利用它的microtask特性,而不是想做DOM监听。核心是microtask,用不用MutationObserver都行的。事实上,vue在2.5版本中已经删去了MutationObserver相关的代码,因为它是HTML5新增的特性,在iOS上尚有bug。

那么最优的microtask策略就是Promise了,而令人尴尬的是,Promise是ES6新增的东西,也存在兼容问题呀。所以vue就面临一个降级策略。

## Vue的降级策略
队列控制的最佳选择是microtask,而microtask的最佳选择是Promise.但如果当前环境不支持Promise,vue就不得不降级为macrotask来做队列控制了。

setImmediate > MessageChannnel > setTimeout
前两个都有兼容性问题，在最后不得不使用setTimeout。

总结：
1. vue用异步队列的方式来控制DOM更新和nextTick回调先后执行。
2. microtask因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完。
3. 因为兼容性问题vue不得不做了microtask想macrotask的降级方案。

# Vue生命周期函数
最早在created中才能操作data数据。对于异步数据的获取最好在这里进行。
最早在mounted中才能操作DOM，其余情况需要使用nextTick操作DOM。

beforeDestroy销毁前 和 destroy销毁后这两个钩子是需要我们手动调用实例上的 $destroy 方法才会触发的。
activated:keep-alive 组件激活时调用。
deactivated:keep-alive 组件停用时调用。
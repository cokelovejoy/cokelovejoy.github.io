---
title: Vue源码分析二
date: 2019-11-11 15:11:34
tags:
---
# 异步更新队列
为了批量操作数据结束之后，再去更新DOM，只用更新一次。
## core/observer/watcher.js update()
dep.notify()之后watcher执行update()函数, 然后回去执行queueWatcher(watcher)函数，将watcher放入队列。

## core/observer/scheduler.js
queueWatcher(watcher)
将watcher插入队列，同时会对watcehr进行去重。再去执行 nextTick(flushSchedulerQueue)
flushSchedulerQueue()函数会清空队列，并去执行watcher.run()方法，然后再去更新视图。
## core/util/next-tick.js
nextTick(flushSchedulerQueue): nextTick按照特定策略去执行异步操作。涉及微任务和宏任务。

测试代码: 给foo赋值会触发watcher中update函数，update执行了三次，watcher进入队列三次，但队列会做去重，最后也只有一个watcher，然后执行这个watcher.run()方法，仅执行一次，也就是说只有最后一次赋值的结果会被浏览器渲染。
```html
<div id="demo">
   <h1>异步更新</h1>
   <p id="p1">{{foo}}</p>
</div>
<script>
    // 创建实例
    const app = new Vue({
        el: '#demo',
        data: { foo: '' },
        mounted() {
            setInterval(() => {                    
                this.foo = Math.random()
                this.foo = Math.random()
                this.foo = Math.random()
                console.log(p1.innerHTML)
                this.$nextTick(() => {
                    console.log(p1.innerHTML)
                })
            }, 1000);
        }
    });
</script>
```

# 宏任务和微任务
# 虚拟DOM
## 概念
虚拟DOM(Virtual DOM) 是对DOM 的JS抽象表示,它就是JS对象,能够描述DOM结构和关系.应用各种状态变化会作用于虚拟DOM,最终映射到DOM.不需要操作DOM，只需对数据更改，就会改变虚拟DOM，再去渲染真实DOM。
<img src="/static/img/virtualdom.png">

## 优点
* 虚拟DOM轻量,快速: 当它们发生变化时,通过新旧虚拟DOM比对可以得到最小DOM操作量,从而提升性能和用户体验.
* 跨平台: 将虚拟dom更新转换为不同运行时特殊操作实现跨平台
* 兼容性: 还可以加入兼容性代码增强操作的兼容性

## 必要性(为什么Vue2.0中虚拟DOM是必需的?)
Vue1.0中有细粒度的数据变化侦测,它是不需要虚拟DOM的,但是细粒度造成了大量开销,这对于大型项目来说是不可接受的.因此,Vue2.0选择了中等粒度的解决方案,每一个组件一个watcher实例,这样状态变化时只能通知到组件,再通过引入虚拟DOM去进行比对和渲染.
## 实现
### core/instance/lifecycle.js mountComponent()
渲染,更新组件
```js
const updateComponent = () => {
    // 实际调用是在lifeCycleMixin中定义的_update和renderMixin中定义的_render
    // _render()执行可以获得虚拟DOM，VNode
    // _update()将虚拟DOM转换成真实DOM，这里有两种情况，组件第一次创建时，生成真实DOM，是不会去patch的，因为第一次没有老的VNode去比较。再就是数据改变时，生成新的VNode，会去比较新旧VNode, 然后去patch，生成真实DOM。
    vm._update(vm._render(), hydrating)
}
new Watcher(this.vm, updateComponent)
```

### core/instance/render.js _render()
生成虚拟DOM

### core/instance/render.js vm.$createElement()
真正用来创建vnode树的函数是vm.$createElement
```js
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

### core/vdom/create-element.js
$createElement() 是对createElement函数的封装.

### core/vdom/create-component.js
createComponent() 用于创建组件并返回VNode

### core/vdom/vnode.js
render返回的一个VNode实例, 它的children还是VNode,最终构成一个树,就是虚拟DOM树.

### core/instance/lifecycle.js
_update负责更新dom,将vnode转换为dom

### platforms/web/runtime/index.js __patch__()
__patch__是在平台特有代码中指定的
```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```
patch 是createPatchFunction的返回值,传递nodeOps和modules是web平台特别实现的.
```js
export const patch: Function = createPatchFunction({nodeOps, modules})
```
### platforms/web/runtime/node-ops.js
定义各种原生dom基础操作方法
### platforms/web/runtime/modules/index.js
modules 定义了属性更新实现

### core/vdom/patch.js patch()
patch的规则
通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式,所以时间复杂度只有O(n),是一种相当高效的算法。
同层级只做三件事:增删改。具体规则是:new VNode不存在就删;old VNode不存在就增;都存在就比较类型,类型不同直接替换、类型相同执行更新;
<img src="/static/img/patch1.png">

#### patchVnode
两个VNode类型相同,就执行更新操作,包括三种类型操作: 属性更新PROPS,文本更新TEXT,子节点更新REORDER.

patchVnode具体规则如下:
1. 如果新旧VNode都是静态的,那么只需要替换elm 以及componentInstance即可。
2. 新老节点均有children子节点,则对子节点进行diff操作,调用updateChildren。
3. 如果老节点没有子节点而新节点存在子节点,先清空老节点DOM的文本内容,然后为当前DOM节点加入子节点。
4. 当新节点没有子节点而老节点有子节点的时候,则移除该DOM节点的所有子节点。
5. 当新老节点都无子节点的时候,就只是文本的替换。

#### updateChildren
updateChildren 主要作用是用一种较高效的方式比对新旧两个VNode的children得出最小操作补丁.执行下一个双循环是传统方式,vue中针对web场景特点做了特别的算法优化.
<img src="/static/img/updateChildren1.png">

在新老两组VNode节点的左右头尾两侧都有一个变量标记,在遍历过程中这几个变量都会向中间靠拢.
当oldStartIdx > oldEndIdx 或者newStartIdx > newEndIdx时结束循环.
遍历规则:
首先,oldStartVnode、oldEndVnode与newStartVnode、newEndVnode两两交叉比较,共有4种比较方法.
当 oldStartVnode和newStartVnode 或者 oldEndVnode和newEndVnode 满足sameVnode,直接将该VNode节点进行patchVnode即可,不需再遍历就完成了一次循环。如下图:

<img src="/static/img/updateChildren2.png">

如果oldStartVnode与newEndVnode满足sameVnode。说明oldStartVnode已经跑到了oldEndVnode后面去了,进行patchVnode的同时还需要将真实DOM节点移动到oldEndVnode的后面。
<img src="/static/img/updateChildren3.png">

如果oldEndVnode与newStartVnode满足sameVnode,说明oldEndVnode跑到了oldStartVnode的前面,进行patchVnode的同时要将oldEndVnode对应DOM移动到oldStartVnode对应DOM的前面。
<img src="/static/img/updateChildren4.png">

如果以上情况均不符合,则在old VNode中找与newStartVnode满足sameVnode的vnodeToMove,若存在执行patchVnode,同时将vnodeToMove对应DOM移动到oldStartVnode对应的DOM的前面。
<img src="/static/img/updateChildren5.png">

当然也有可能newStartVnode在old VNode节点中找不到一致的key,或者是即便key相同却不是sameVnode,这个时候会调用createElm创建一个新的DOM节点。
<img src="/static/img/updateChildren6.png">

至此循环结束,但是我们还需要处理剩下的节点。
当结束时oldStartIdx > oldEndIdx,这个时候旧的VNode节点已经遍历完了,但是新的节点还没有。说明了新的VNode节点实际上比老的VNode节点多,需要将剩下的VNode对应的DOM插入到真实DOM中,此时调用addVnodes(批量调用createElm接口)。
<img src="/static/img/updateChildren7.png">

但是,当结束时newStartIdx > newEndIdx时,说明新的VNode节点已经遍历完了,但是老的节点还有剩余,需要从文档中删 的节点删除。
<img src="/static/img/updateChildren8.png">

# 总结
## 异步更新: 批量异步执行组件更新
 dep.notify() => watcher.update() => queueWatcher() => nextTick() => timerFunc() => flushSchedulerQueue() => watcher.run()
* core/observer/index.js reactiveSetter() 通知更新
* watcher.js update() 入队
* core\observer\scheduler.js 加入异步任务
* core\util\next-tick.js 加入回调,启动任务队列
* timerFunc() 启动异步执行任务
* watcher.run() 更新操作
## 虚拟DOM: 利用patching算法转换虚拟DOM为真实DOM
### 什么是虚拟DOM?
用来描述DOM树的JS对象。
### 为什么需要虚拟DOM?
因为Vue2.x中，一个组件一个watcher，在数据改变之后，要通过比较新旧DOM，来做更新操作，因此需要虚拟DOM。

watcher.run() => updateComponent() => _render() => _update() => vm.__patch() => patch()
* watcher.js run()
* core/instance/lifecycle.js mountComponent() updateComponent()
* core/instance/render.js _render() 计算虚拟DOM
* core/instance/lifecycle.js _update() 把虚拟DOM变成真实DOM
* platforms/web/runtime/index.js __patch() patch算法
* core/vdom/patch.js patch()
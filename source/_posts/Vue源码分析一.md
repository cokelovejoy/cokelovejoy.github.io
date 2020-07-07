---
title: Vue源码分析一
date: 2019-11-08 14:13:03
tags:
---
# 获取Vue源码
Vue源码地址: https://github.com/vuejs/vue
当前版本号: 2.6.10
## 获取源代码
```bash
$ git clone https://github.com/vuejs/vue.git
```
# 调试环境搭建
## 安装依赖: 
```bash
$ npm install
```
## 全局安装rollup:
rollup是打包工具,专门用于打包js代码
```bash
npm install -g rollup
```
## 修改package.json的dev选项,添加 --sourcemap
```bash
# dev 选项中 : -c scripts/config.js 指明 配置文件所在
# 参数TARGET:web-full-dev 指明 输出文件配置项((scripts/config.js,line:123))
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-
full-dev"
```
## 运行开发命令
```bash
npm run dev
```
## 新建html文件用于浏览器调试
/examples/test/test.html
引用 vue.js
```html
<script src="/dist/vue.js"></script>
```
# 入口文件
vue 各版本: /dist
vue.runtime.common.js 用于webpack 1.x, browserify.
vue.runtime.esm.js 用于webpack 2.x.

## 查看 /scripts/config.js (line:123)
入口文件在 /src/platforms/web/entry-runtime-with-compiler.js，源码分析从这个文件开始.
```js
    {
        // Runtime+compiler development build (Browser)
        'web-full-dev': {
            entry: resolve('web/entry-runtime-with-compiler.js'), // 入口
            dest: resolve('dist/vue.js'),// 目标文件
            format: 'umd', // 输出规范
            env: 'development',
            alias: { he: './entity-decoder' },
            banner
        },
    }
```

# 初始化流程
入口: /src/platforms/web/entry-runtime-with-compiler.js
扩展默认的$mount方法: 在不同的平台有不同的处理方式。在浏览器平台，在没有render选项时去处理template，没有template去处理el选项。但是最终都会将模板字符串变为render函数。


## src/platforms/web/runtime/index.js
定义了$mount方法，执行挂载mountComponent(this, el, hydrating) : 挂载根组件到指定宿主元素
定义__patch__: 补丁函数，做diff操作，比较新旧VDOM，然后再决定如何更新DOM。

## src/core/index.js
### 初始化全局API
```js
// 初始化全局API
initGlobalAPI(Vue)
```

### 实现全局API,具体如下:
```js
// src/core/global-api/index.js
Vue.set = set
Vue.delete = del
Vue.nextTick = nextTick
initUse(Vue) // 实现Vue.use函数
initMixin(Vue) // 实现Vue.mixin函数
initExtend(Vue) // 实现Vue.extend函数
initAssetRegisters(Vue) // 注册实现Vue.component/directive/filter
```
## src/core/instance/index.js
### Vue构造函数定义，实例api定义
```js
function Vue (options) {
    // 构造函数仅执行了_init
    this._init(options)
}
initMixin(Vue)  // 实现init函数
stateMixin(Vue) // 状态相关api $data,$props,$set,$delete,$watch
eventsMixin(Vue)// 事件相关api $on,$once,$off,$emit
lifecycleMixin(Vue) // 生命周期api _update,$forceUpdate,$destroy
renderMixin(Vue)// 渲染api _render,$nextTick
```
## src/core/instance/init.js
### 创建组件实例,初始化其数据、属性、事件等
```js
initLifecycle(vm)  // 初始化$parent,$root,$children,$refs
initEvents(vm)     // 处理父组件传递给当前组件实例的监听器
initRender(vm)     // 渲染相关：$slots,$scopedSlots,_c,$createElement
callHook(vm, 'beforeCreate') // 在beforeCreate 之中无法拿到 state
initInjections(vm) // resolve injections before data/props 获取注入的数据(父组件的)
initState(vm)      // 初始化组件中的props，methods，data，computed, watch。对这些数据做响应式。
initProvide(vm)    // resolve provide after data/props 提供数据注入 
callHook(vm, 'created') // 要拿到state 最早要在created 钩子函数中
```
## src/core/instance/lifecycle.js
### lifecycleMixin(Vue)
```js
// lifecycleMixin(Vue)
// 添加以下方法到Vue上
Vue.prototype._update
Vue.prototype.$forceUpdate
Vue.prototype.$destroy
```
### mountComponent()方法 执行挂载
```js
// ...
callHook(vm, 'beforeMount')

// 定义组件更新函数 updateComponent()
// vm._render()执行可以获得虚拟DOM,VNode
// vm._update()将虚拟DOM转换成真实DOM
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}
// 声明一个render watcher 用于update
new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

  // 手动挂载
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
```

## src/core/instance/events.js
### initEvents(vm)
初始化 父组件的监听器
```js
// initEvents(vm)
const listeners = vm.$options._parentListeners
if (listeners) {
    updateComponentListeners(vm, listeners)
}
```
### eventsMixin(Vue)
```js
// 注册事件
Vue.prototype.$on()
Vue.prototype.$once()
Vue.prototype.$off()
Vue.prototype.$emit()
```

## src/core/instance/render.js
### 初始化render initRender()
```js
// 注册createElement()方法
// args order: tag, data, children, normalizationType, alwaysNormalize
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```
### renderMixin()
```js
Vue.prototype.$nextTick()   // 注册$nextTick()函数
Vue.prototype._render()     // 注册_render()函数,该函数返回VNODE
```
# 数据响应式

Vue一大特点是数据响应式,数据的变化会作用于UI而不用进行DOM操作。原理上来讲,是利用了JS语
言特性Object.defineProperty(),通过定义对象属性setter方法拦截对象属性变更,从而将数值的变化
转换为UI的变化。
具体实现是在Vue初始化时,会调用initState,它会初始化data,props等,这里着重关注data初始化,

## src/core/instance/state.js
初始化数据
* proxy()代理方法
```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  // 在对象上定义一个新属性.
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

* initState(vm)
如果$options里面有 props methods data computed watch就要对他们进行初始化
```js
initProps(vm, opts.props)
initMethods()
initData()
initComputed(vm, opts.computed)
initWatch(vm, watch)
```
* initData()
核心代码就是将data数据响应化
```js
function initData (vm: Component) {
    //获取data
    let data = vm.$options.data
    data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    // ...
    // 代理data到实例上
    // observe data : 数据遍历 ,响应化处理
    observe(data, true /* asRootData */)
}
```
## src/core/observer/index.js
Observer对象根据数据类型执行对应的响应化操作
defineReactive定义对象属性的getter/setter,getter负责添加依赖,setter负责通知更新
* observe()方法返回一个Observer对象实例
```js
 ob = new Observer(value)
```
* defineReactive()方法响应化处理
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  // 获取自有属性的属性描述符
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 如果内部是对象,递归处理
  let childOb = !shallow && observe(val)
  // 数据拦截,给对象的属性增加get 和 set
  // 当获取属性值或属性发生改变时都会去执行get set 里面的函数
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      // 依赖收集
      if (Dep.target) {
        dep.depend() //追加 依赖关系
        // 如果有子ob存在
        if (childOb) {
          childOb.dep.depend()
          // 如果是数组还要继续处理
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal // 更新value
      }
      // 如果用户设置的值是对象, 还需要额外的响应化处理
      childOb = !shallow && observe(newVal)
      // 通知更新
      dep.notify()
    }
  })
}
```


## src/core/observer/dep.js
Dep负责管理一组Watcher,包括watcher实例的增删及通知更新
* depend()
```js
// class Dep
depend () {
    if (Dep.target) {
      // 建立 和 Watcher实例之间的关系, dep 和 watcher 可能是多对多的关系
      Dep.target.addDep(this)
    }
  }
```
* Watcher
Watcher解析一个表达式并收集依赖,当数值变化时触发回调函数,常用于$watch API和指令中。
每个组件也会有对应的Watcher,数值变化会触发其update函数导致重新渲染
```js
// watcher 在vue2.x版本里面 是一个组件一个watcher.可能里面有一些watch选项.
export default class Watcher {
    constructor () {}
    //Evaluate the getter, and re-collect dependencies.
    // 触发依赖收集的地方
    get () {} 
    // Add a dependency to this directive.
    addDep (dep: Dep) {}
    // Clean up for dependency collection.
    cleanuoDeps()
    // Subscriber interface. Will be called when a dependency changes.
    update ()
    // Scheduler job interface.Will be called by the scheduler.
    run()
    // Evaluate the value of the watcher.This only gets called for lazy watchers.
    evaluate()
    // Depend on all deps collected by this watcher.
    depend()
    // Remove self from all dependencies' subscriber list.
    teardown()
}
```
# 数组的响应化
数组数据变化的侦测跟对象不同,以下数组方法(变异方法)对数组数据操作,让原数组被改变,但是页面此时没有办法得知数据变化。
所以vue中采取的策略是拦截这些方法并通知dep。
'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'

* src/core/observer/index.js
Observer中覆盖数组原型
```js
if (Array.isArray(value)) {
  // 替换数组原型
  protoAugment(value, arrayMethods) // value.__proto__ = arrayMethods
  this.observeArray(value)
}
```
* src\core\observer\array.js 
为数组原型中的7个可以改变内容的方法定义拦截器
```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 数组的原型方法
  const original = arrayProto[method]
  // 拦截,添加额外行为
  def(arrayMethods, method, function mutator (...args) {
    // 执行原先的任务
    const result = original.apply(this, args)
    // 额外任务: 通知更新
    const ob = this.__ob__
    // 以下三个操作需要额外响应化处理
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```
理解响应式原理的实现,注意以下事项:
* 对象各属性初始化时进行一次响应化处理,以后再动态设置是无效的
```js
// data: {obj:{foo: 'foo'}}
// 无效
this.obj.bar = 'bar'
// 有效
this.$set(this.obj, 'bar', 'bar')
```
* 数组是通过方法拦截实现响应化处理,不通过方法操作数组也是无效的
Vue内部对数组的7个变异方法做过封装,因此只有使用变异方法改变数组数据才能更新到页面
```js
// data: {items: ['foo','bar']}
// 无效
this.items[0] = 'tua'
this.items.length = 0
// 有效
this.$set(this.items, 0, 'tua')
this.items.splice(0, 2)
```

# 总结
* 初始化过程: init --> $mount --> compile --> new Watcher --> render --> update
1. runtime/index : 实现$mount
2. core/index: 全局api
3. core/instance/index: 声明vue构造函数
4. entry-runtime-with-compiler: 覆盖$mount
5. core/instance/lifecycle: mountComponent 执行渲染和更新,计算虚拟DOM,并转换成真实DOM,并挂载到$el上.
* 响应化
1. observe(): 返回Observer实例.
2. Observer类: 区分当前值的类型是对象还是数组.
3. defineReactive
4. Dep类: 依赖收集
5. Watcher类

Dep 和 Watcher 的关系
依赖收集 : 使用了data选项中的每个数据，就称依赖了这个数据.
每个组件实例有一个Wathcer. 当对象或者数组里的值 发生变化的时候, 就要通知组件的Watcher 去通知(notify)更新.
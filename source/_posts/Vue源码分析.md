---
title: Vue源码分析
date: 2019-11-08 14:13:03
tags:
---
# 获取Vue源码
Vue源码地址: https://github.com/vuejs/vue
当前版本号: 2.6.10
```bash
$ git clone https://github.com/vuejs/vue.git
```
# 调试环境搭建
* 安装依赖: 
```bash
$ npm install
```
* 全局安装rollup:
rollup是打包工具,专门用于打包js代码
```bash
npm install -g rollup
```
* 修改package.json的dev选项,添加 --sourcemap
```
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-
full-dev"
```
* 运行开发命令
```bash
npm run dev
```
* 新建html文件用于浏览器调试
/examples/test/test.html
引用 vue.js
```html
<script src="/dist/vue.js"></script>
```

# 入口
vue 各版本:
vue.runtime.common.js 用于webpack 1.x, browserify.
vue.runtime.esm.js 用于webpack 2.x.
dev 选项中 : -c scripts/config.js 指明 配置文件所在
参数TARGET:web-full-dev 指明 输出文件配置项(scripts/config.js,line:123)
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
以上配置可以看出: 入口文件在 src/platforms/web/entry-runtime-with-compiler.js
源码分析从这个文件开始.

# 初始化流程
入口: src/platforms/web/entry-runtime-with-compiler.js
扩展 默认的$mount方法: 处理template 或 el选项

## src/platforms/web/runtime/index.js
定义$mount : 挂载根组件到指定宿主元素
定义__patch__: 补丁函数,执行patching 算法 ,执行数据更新,再更新DOM

## src/core/index.js
```js
// 定义全局API
initGlobalAPI(Vue)
```
实现全局API,具体如下:
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
Vue构造函数定义,实例api定义.
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
创建组件实例,初始化其数据、属性、事件等
```js
initLifecycle(vm) // $parent,$root,$children,$refs
initEvents(vm)  // 处理父组件传递的监听器
initRender(vm)  // $slots,$scopedSlots,_c,$createElement
callHook(vm, 'beforeCreate')
initInjections(vm) // 获取注入数据
initState(vm)   // 初始化props,methods,data,computed,watch
initProvide(vm)   // 提供数据注入
callHook(vm, 'created')
```
## src/core/instance/lifecycle.js
mountComponent()方法 执行挂载

# 数据响应式

Vue一大特点是数据响应式,数据的变化会作用于UI而不用进行DOM操作。原理上来讲,是利用了JS语
言特性Object.defineProperty(),通过定义对象属性setter方法拦截对象属性变更,从而将数值的变化
转换为UI的变化。
具体实现是在Vue初始化时,会调用initState,它会初始化data,props等,这里着重关注data初始
化,

## src/core/instance/state.js
初始化数据

initData核心代码就是将data数据响应化
```js
function initData (vm: Component) {
    //获取data
    let data = vm.$options.data
    data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    // 代理data到实例上
    // ...

    // 执行数据响应化
    observe(data, true /* asRootData */)
}
```

## src/core/observer/index.js
observe方法返回一个Observer实例

Observer对象根据数据类型执行对应的响应化操作
defineReactive定义对象属性的getter/setter,getter负责添加依赖,setter负责通知更新

## src/core/observer/dep.js
Dep负责管理一组Watcher,包括watcher实例的增删及通知更新
* Watcher
Watcher解析一个表达式并收集依赖,当数值变化时触发回调函数,常用于$watch API和指令中。
每个组件也会有对应的Watcher,数值变化会触发其update函数导致重新渲染
```js
export default class Watcher {
    constructor () {}
    get () {}
    addDep (dep: Dep) {}
    update () {}
}
```
# 数组的响应化
数组数据变化的侦测跟对象不同,我们操作数组通常使用push、pop、splice等方法,此时没有办法得
知数据变化。所以vue中采取的策略是拦截这些方法并通知dep。
## src\core\observer\array.js
为数组原型中的7个可以改变内容的方法定义拦截器
Observer中覆盖数组原型
```js
if (Array.isArray(value)) {
  // 替换数组原型
  protoAugment(value, arrayMethods) // value.__proto__ = arrayMethods
  this.observeArray(value)
}
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
依赖收集 : 对Object或Array 的每个key 做监听,我们就称之为依赖.
每个组件实例有一个Wathcer. 当对象或者数组里的值 发生变化的时候, 就要通知组件的Watcher 去通知(notify)更新.
---
title: vue-component
date: 2019-10-10 11:40:16
tags:
---
Vue 组件化实践

# 组件化
组件化是vue 的核心思想，提高开发效率，方便重复使用，简化调试，提升整个项目的可维护性，便于多人协同开发。

## 组件通信
### 父组件将数据传入(获取)子组件内的方法
* props 属性
```bash
# 在父组件中使用子组件，通过自定义属性的方式，将指定的数据传入子组件。
<childcomponent msg="welcome to vue"></childcomponent>
# 在子组件内部，要使用父组件传入的数据，可以先使用props属性指定传入的属性，然后就可以通过this.msg的方式访问
props: { msg: string}
```
* 实例属性 $attrs
$attrs对象会包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。
当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件,内部组件的$attrs就包含了外层组件的$attrs对象中的内容——在创建高级别的组件时非常有用。
```bash
# 前提 是没有在子组件中使用props声明。
# 父组件中
<childcomponent msg="welcome to vue"></childcomponent>
# 将父组件的所有绑定的属性传给子组件(除了class和style)
<childcomponent v-bind="$attrs"></childcomponent>
# 子组件中 并未在props中声明msg，可以在子组件中使用$attrs
<p>{{ $attrs.msg }}</p>
```
* 使用ref和$refs ，可以引用子组件内部的数据和方法
```bash
# 父组件
<childcomponent ref="child"></childcomponent>
# 在父组件中就可以使用子组件中的数据 和 方法
mounted() {
    this.$refs.child.foo = 'xxxx'
}
```
* 实例属性$children
当前实例的直接子组件。需要注意 $children 并不保证顺序，也不是响应式的。如果你发现自己正在尝试使用 $children 来进行数据绑定，考虑使用一个数组配合 v-for 来生成子组件，并且使用 Array 作为真正的来源。
```bash
# 父组件
this.$children[0].foo = 'xxx'
```

### 子组件使用父组件内的数据的方法
* 使用 $parent 来访问父组件的数据
$parent : 当前组件的父实例
$root : 当前组件树的根Vue实例。如果当前实例没有父实例，此实例将会是其自己。
```
this.$parent.xxx
```
### 给子组件绑定事件的方式 和 $emit
* 通过子组件调用时，传递参数的方式，将子组件的数据传递到父组件，给父组件使用。
```bash
# 父组件内 在子组件上自定义事件，并绑定这个事件触发时，要执行的函数。
# $event : 通过$event 可以访问原始的 DOM 事件。
<childcom @addevent="func($event, argu)"></childcom>

func(event,argu) {
    ...code block
}
# 子组件内 触发这个自定义事件, 并传递参数,这个参数可以让父组件的变量接收,从而达到改变父组件的数据的作用.
this.$emit('addevent', 'argument')
```

### 兄弟组件之间传值的方法
* 方法1
思想 ： 父组件做桥梁,先通过父组件给 子组件1 传递一个 事件，子组件触发这个事件的时候，会改变父组件的data，并且将这个data通过自定义属性的方式传递给 子组件2,子组件2 内使用props声明，就能使用 这个data。从而达到 兄弟组件之间传值的目的。
```bash
# parent component
<component1 @showMsg="func"></component1>
<component2 :msg="msg"></component2>

data: msg:''

methods:
func(msg) {
    this.msg =msg
}
# component1
this.$emit('showMsg', 'news')

# component2
props: {
    msg: string
}
```

* 方法2
$on: 监听一个自定义事件,回调函数就是事件触发时要执行的操作,$emit触发事件,回调函数会接受参数并处理.
$emit: 触发当前实例上的事件。附加参数都会传给监听器的回调函数。
```bash
# component1 send data 
this.$parent.$emit('showMsgevent'， 'message')
# component2 receive data 
this.$parent.$on('showMsgevent', (msg) => {
    this.msg = msg
})
```
### 祖先和后代之间传值
嵌套层数过多时， 传递props不切实际，vue 提供了 provide/inject API 实现。
这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。
* provide/inject选项
provide 选项应该是一个对象或返回一个对象的函数。
提示：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。
```bash
# 父级组件
provide: {
    foo: 'foo'
}
# 函数写法
provide() {
    return {
      author: 'richard'
    }
}
# 子组件注入
inject: ['foo']
# 子组件注入
inject: {
    foo: {
        from: 'bar',
        default: 'foo'
    }
}
# 在子组件中使用
this.foo
```
### 任意两个组件之间传值： 事件总线 或者 vuex
* 事件总线
```bash
# 新建Bus.js: 事件派发、监听和回调管理
class Bus{
    constructor(){
        this.callbacks = {}
    }
    $on(name, fn){
        this.callbacks[name] = this.callbacks[name] || []
        this.callbacks[name].push(fn)
    }
    $emit(name, args){
        if(this.callbacks[name]){
            this.callbacks[name].forEach(cb => cb(args))
        }
    }
}
# main.js
Vue.prototype.$bus = new Bus()
# child1
this.$bus.$on('foo', handle)
# child2
this.$bus.$emit('foo')
```

* 实践中可以使用Vue代替Bus类， 因为Vue已经实现了相应的功能
```bash
# 新建一个Bus.js文件 写如下内容即可
import Vue from 'vue'
export default new Vue

# 在组件中要导入Bus.js
# component1 
import Bus from 'Bus.js'
Bus.$on('foo', handle)

# component2
import Bus from 'Bus.js'
Bus.$emit('foo', 'text')
```

### 插槽
插槽语法是Vue 实现的内容分发 API,用于复合组件开发。该技术在通用组件库开发中有大量应用。
* 匿名插槽
```bash
# component
<div>
    <slot></slot>
</div>
# parent
# hello world 会插入slot元素所在的位置
<component> hello world</component>
```
* 具名插槽
将内容分发到子组件的指定位置 
```bash
# component
<div>
    <slot></slot>
    <slot name="message"></slot>
</div>

# parent
<component>
    <!-- 默认插槽使用 default 做参数 -->
    <template v-slot:default>具名插槽</template>
    <template v-slot:message>信息</template>
</component>
```
* 作用域插槽
为了让插槽内容能够访问子组件中才有的数据时,就要使用作用域插槽.
```bash
#  绑定在 <slot> 元素上的特性被称为插槽 prop。
#  现在在父级作用域中，我们可以给 v-slot 带一个值来定义我们提供的插槽 prop 的名字(slotProps),也可以自定义为其他的名字.
# child component
<div>
    <!-- 此处的foo 是 子组件中的数据, 通过绑定特性的方式传入 要分发的内容(component)中 -->
    <slot :foo="foo"></slot>
</div>
# parent 
<childcom>
    <!-- 把 v-slot的值指定为 作用域上下文对象 -->
    <template v-slot:default="slotProps">
        使用来自子组件数据: {{ slotProps.foo }}
    </template>
</childcom>
```
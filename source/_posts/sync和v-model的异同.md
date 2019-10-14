---
title: .sync和v-model的异同
date: 2019-10-14 09:57:26
tags:
---
使用sync 可以实现和 v-model 相同的效果,但是它们之间有何异同呢?

## v-model
v-model通常用于表单控件,这样子组件有更强控制能力.
```html
<template>
    <!-- v-model 是语法糖 -->
    <!-- 等效于下面这行 -->
    <z-input :value="username" @input="username=$event"><z-input>
</template>

```
```html
<template>
    <z-checkbox v-model="remember"></z-checkbox>
    <!-- 设置model选项修改默认行为 等效于下面这行 -->
    <!-- <z-checkbox :checked="remember" @change="remember=$event"></z-checkbox> -->
</template>
<script>
export default {
    model: {
        prop: 'checked',
        event: 'change'
    }
}
</script>
```

## .sync修饰符
sync 修饰符2.3.0+新增,它能用于修改传递到子组件的属性.
```html
<template>
    <z-input :foo.sync="username"></z-input>
    <!-- 等效于下面这行 -->
    <z-input :foo="username" @update:foo="username=$event"></z-input>
</template>
    
 <!-- z-input 内部 -->
 <input @input="$emit('update:foo', $event)"></input>
```

出现 sync的原因:
在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。所以用 update:myPropName 的模式触发事件取而代之.
内部实现原理:
```js
// 子组件内部 
this.$emit('update:title', newTitle)
```
```html
<!-- 父组件 -->
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```
简写方式.sync修饰符:
```html
<text-document v-bind:title.sync="doc.title"></text-document>
```
同时设置多个prop时,使用对象将每一个属性都作为一个独立的prop传进去,然后各自添加用于更新的v-on监听器.
```html
    <text-document v-bind.sync="doc"></text-document>
```
总结: 
    场景:父组件传递的属性子组件想修改
    所以sync修饰符的控制能力都在父级,事件名称也相对固定update:xx
    习惯上表单元素用v-model


---
title: Problems in working
date: 2019-11-02 13:14:36
tags:
---

# Problems in working
此章用于总结工作中遇到的问题.

## [Vuex]:  Don't mutate vuex store state outside mutation handler
* 问题产生的原因: 
在mutations 之外改变了vuex store state中的数据,就会产生这个报错,而且 这个只会在strict: true 的时候产生.
* 配置strict:
```js
export default new Vuex.Store({
  strict: true,
  modules: {
    add: add,
    test: test
  }
})
```
* 现象:
```js
export default {
  data() {
    return {
      formModel: {
        'test': ''
      }
    }
  },
  methods: {
    changeStoreValue() {
      this.formModel['test'] = 'hello'
      console.log(this.formModel['test'])
      console.log(this.$store.state.test.storeValue)
    },
    printVal() {
      // 这种写法 改变this.formModel 也会引发 Vuex warning : Don't mutate vuex store state outside mutation handler
      // 实际上就是: arry变量 使用了 this.formModel 的引用 ,当arry 成为state后, this.formModel的值改变,arry也会跟着改变
      // 因此会引发上述的vuex warning,这种比较难发现,因此要注意.
      let arry = [this.formModel]
      // 使用以下写法
      // let arrt = [Object.assign({}, this.formModel)]
      this.$store.commit('test/setStoreValue', arry)
    }
  }
}
```
* 解决方法: 
1. state中存的是基本数据类型 boolean, string, number 重新赋值给新的变量, 通过操作新的变量达到处理数据的目的
```js
// 假设 this.$store.state.test.message = ''
let newVal = this.$store.state.test.message
```
2. state 中存的是引用数据类型, array, object (注:null 也是 object)
```js
// 假设 this.$store.state.test.message = []
// 方法一: 
// slice 方法: 会返回一个新的数组.一块新的内存空间,这样改变newArray时 不会改动this.$store.state.test.message
let newArray = this.$store.state.test.message.slice()
// 方法二: 
// Object.assign()方法 用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
let newArray = Object.assign([], this.$store.state.test.message)

// 假设 this.$store.state.test.message = {}
let newObj = Object.assign({}, this.$store.state.test.message)
```
总结:
在解决vuex store mutation的问题时,实际上就变成了对基本数据类型和引用数据类型的处理的问题.
基本数据类型string,number,boolean在赋值之后,会分配一块新的内存空间来存储值,因此改变新的变量和原来的变量相互不影响.
引用数据类型array,object,在赋值操作之后, 并不会分配一块新的内存空间,而是将旧的变量的引用(也可以叫内存地址)赋给新的变量,因此新旧两个变量改变时,会互相影响. 因此在编程时,要尤其注意,修改一个对象或数组后,要考虑是否会改变原来的值,原来的值在之后使用可能又会影响其他的值.所以我们要操作一个引用型的数据时要做一个副本的拷贝的工作,以保证原来的值不会以一种难以发现的方式被修改,以致于混乱.
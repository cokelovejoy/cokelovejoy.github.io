---
title: vue组件化实战
date: 2019-10-11 11:33:40
tags:
---
目标: 通过vue 实现自己的 表单组件: input, form
效果: 实现类似如一些前端组件库里面提供的表单组件

# 组件实战
## 实现input 组件
 * 创建 components/Zinput.vue
```
<template>
  <div>
    <input :type="type" :value="value" @input="onInput($event)">
  </div>
</template>

<script>
export default {
  name: 'ZInput',
  data() {
    return {
      a: 'a'
    }
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods:{
    onInput(e) {
      // 触发父组件给当前组件绑定的input事件. 并将子组件里写入input的值作为参数传入.
      this.$emit('input', e.target.value)
    }
  }
}
</script>
```
 * 父组件中使用Zinput
```

<template>
  <div id="app">
    <!-- <z-input v-model="msg.account"></z-input> -->
    <!-- v-model实际只是一个语法糖， 真正的原理是下面的value + input -->
    <z-input :value="msg.account" @input="msg.account=$event"></z-input>
    <p>{{ msg.account }}</p>
  </div>
</template>
<script>
import ZInput from './components/Zinput.vue'

export default {
  name: 'app',
  components: {
    ZInput
  },
  data() {
    return {
      msg: {
        account: '',
        password: ''
      }
    }
  }
}
</script>
```
---
title: vue组件化实战
date: 2019-10-11 11:33:40
tags:
---
目标: 通过vue 实现自己的 表单组件: input, form
效果: 实现类似如一些前端组件库里面提供的表单组件

# 组件实战
表单组件内部原理:
1. input 输入框,要实现双向绑定.
2. form-item 实现了自己的内容验证(validate函数),当input 没有输入时,会触发.
3. 在最外层form组件里,点击提交button,会进行全局的input内容校验.然后就会触发通知弹窗,根据校验的结果显示不同的notice信息.

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
      // 通知父组件form-item 做内容校验
      this.$parent.$emit('validate')
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

## 实现form-item 组件
* 创建 components/ZFormItem.vue
组件内引用了 异步验证的库async-validator,需要先使用npm install async-validator -S安装这个库.
```
<template>
    <div>
        <label v-if="label">{{ label }}</label>
        <slot></slot>
        <p v-if="errorMessage">{{errorMessage}}</p>
    </div>
</template>
<script>
import Schema from 'async-validator'
export default {
    name: 'ZFormItem',
    inject: ['form'], // 注入
    props: {
        label: { // 输入项标签
            type: String,
            default: ''
        },
        prop: { // 字段名
            type: String,
            default: ''
        }
    },
    data() {
        return {
            errorMessage: '' //校验错误
        }
    },
    mounted() {
        // 监听 validate事件
        this.$on('validate', () => {
            this.validate()
        })
    },
    methods: {
        validate() {
            // 获取对应FormItem 的校验规则
            const rule = this.form.rules[this.prop]
            // 获取校验值
            const msg = this.form.msg[this.prop]
            // 创建校验规则
            const descriptor = { [this.prop]: rule }
            // 创建校验器
            const schema = new Schema(descriptor)
            // 校验返回Promise对象,没有触发catch就说明验证通过
            return schema.validate({ [this.prop]: msg}, error => {
                if (error) {
                    // 将错误信息显示
                    this.errorMessage = error[0].message;
                } else {
                    // 校验通过
                    this.errorMessage = ''
                } 
            })
            
        }
    }

}
</script>
```
## 实现form 组件 
* 创建 components/ZForm.vue
```
<template>
    <div>
        <slot></slot>    
    </div>
</template>
<script>
export default {
    provide() {
        return {
            form: this // 将当前组件实例作为提供者, 子代组件可以更加方便的获得
        }
    },
    props: {
        msg: {
            type: Object,
            required: true
        },
        rules: {
            type: Object
        }
    },
    methods: {
        // 表单全局验证, 为Form 提供validate方法.
        validate(callback) {
            console.log("全局校验")
            // 1. 先筛选出含有prop属性的子组件,然后调用它们的validate方法并得到Promise数组
            const tasks = this.$children
                .filter(item => item.prop)
                .map(item => item.validate())
            // 2. 所有任务必须全部成功才算校验通过
            Promise.all(tasks)
                .then(() => callback(true))
                .catch(() => callback(false))
        }
    }
}
</script>
```
## 实现通知组件
* 创建 components/Notice.vue
```
<template>
    <div class="box" v-if="isShow">
        <h3>{{ title }}</h3>
        <p class="box-content">{{ message }}</p>
    </div>
</template>
<script>
export default {
    name: 'Notice',
    props: {
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        },
        duration: {
            type: Number,
            default: 1000
        }
    },
    data() {
        return {
            isShow: false
        }
    },
    methods: {
        show() {
            this.isShow = true
            setTimeout(this.hide, this.duration)
        },
        hide() {
            this.isShow = false;
            this.remove();
        }
    }
}
</script>
<style scoped>
.box {
    position: fixed;
    width: 100%;
    top: 16px;
    left: 0;
    text-align: center;
    pointer-events: none;
    background-color: #fff;
    border: grey 3px solid;
    box-sizing: border-box;
}
.box-content {
    width: 200px;
    margin: 10px auto;
    font-size: 14px;  
    padding: 8px 16px;
    background: #fff;
    border-radius: 3px;
    margin-bottom: 8px;
}
</style>
```
## 实现弹窗组件
弹窗组件的特点是他们在当前vue实例之外独立存在,通常挂载在body上;它们是通过JS 动态创建的, 不需要在任何组件中声明.通过create函数,来动态创建 通知组件.
* 创建 utils/create.js
```
import Vue from 'vue'

// create函数 接收要创建的组件 和传入的值 作为参数
function create(Component, props) {
    // 1. 创建Component实例
    const vm = new Vue({
        // render函数将传入组件配置对象转换为虚拟dom
        render(h) {
            // 渲染函数 使用
            // h == createElement
            // h(Component) => vdom
            return h(Component, { props })
        }
    }).$mount() // 执行挂载函数,但未制定挂载目标,表示只执行初始化工作(先渲染不挂载)

    // 方式2：Vue.extend() 返回组件构造函数
    // const Ctor = Vue.extend(Component)
    // const comp = new Ctor({propsData: props})    
    // document.body.appendChild(comp.$el)
    // 将生成的dom元素 追加至 body

    // 获取dom
    document.body.appendChild(vm.$el)
    // 2. 挂载 
    const comp = vm.$children[0]
    // 3. 销毁
    comp.remove = () => {
        document.body.removeChild(vm.$el)
        vm.$destroy()
    }
    return comp
}
export default create
```
## 使用Form 表单.
* 创建 index.vue
```
<template>
    <div>
        <h3>ZForm表单</h3>
        <hr>
        <z-form :msg="msg" :rules="rules" ref="loginForm">
            <z-form-item label="用户名" prop="username">
                <z-input v-model="msg.username"></z-input>
            </z-form-item>
            <z-form-item label="密码" prop="password">
                <z-input type="password" v-model="msg.password"></z-input>
            </z-form-item>
            <z-form-item>
                <button @click="submitForm">Submit</button>
            </z-form-item>
        </z-form>
    </div>
</template>
<script>
import ZForm from '../ZForm'
import ZFormItem from '../ZFormItem'
import ZInput from '../Zinput'
import create from '@/utils/create.js'
import Notice from '@/components/form/Notice'
export default {
    components: {
        ZForm,
        ZFormItem,
        ZInput
    },
    data() {
        return {
            rules: {
                username: [{ required: true, message: "请输入用户名" }],
                password: [{ required: true, message: "请输入密码" }]
            },
            msg: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs.loginForm.validate(valid => {
                const notice = create(Notice, {
                    title: "Notice",
                    message: valid ? "请求登录!" : "校验失败!",
                    duration: 3000
                })
                notice.show()
            })
        }
    }
}
</script>
```
# 递归组件
递归组件是可以在它们自己模板中调用自身的组件.
* 创建recursion/node.vue
```
<template>
    <div>
        <h3>{{ data.title }}</h3>
        <!-- 递归组件必须要有结束的条件 -->
        <node v-for="d in data.children" :key="d.id" :data="d"></node>
    </div>
</template>
<script>
export default {
    name: 'Node', // name 对递归组件是必要的.
    props: {
        data: {
            type: Object,
            required: true
        }
    }

}
</script>
```
* 使用node.vue
```
<template>
    <div>
        <node :data="data"></node>
    </div>
</template>
<script>
import Node from "./Node.vue"
export default {
    components: {
        Node
    },
    data() {
        return {
            data: {
                id: '1',
                title: '递归组件使用手册',
                children: [
                    { id: '1-1', title: '使用方法'},
                    { id: '1-2', title: '注意事项'}
                ]
            }
        }
    }
}
</script>
```
## Tree递归组件实现
Tree组件是典型的递归组件,其他的诸如菜单组件都属于这一类,也是相当常见的。
* 创建components/tree/Titem.vue
```
<template>
    <div>
        <li>
            <div @click="toggle">
                {{model.title}}
                <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
            </div>
            <ul v-show="open" v-if="isFolder">
                <t-item class="item" v-for="m in model.children" :model="m" :key="m.title"></t-item>
            </ul>
        </li>
    </div>
</template>
<script>
export default {
    name: "TItem",
    props: {
        model: Object
    },
    data() {
        return {
            open: false
        }
    },
    computed: {
        isFolder() {
            return this.model.children && this.model.children.length
        }
    },
    methods: {
        toggle() {
            if (this.isFolder) {
                this.open = !this.open
            }
        }
    }
}
</script>
```
* 使用Titem
```
<template>
 <div id="app">
   <ul>
     <t-item class="item" :model="treeData"></t-item>
   </ul>
 </div>
</template>
<script>
import TItem from "./Titem.vue";
export default {
    data() {
        return {
            treeData: {
                title: "Web全栈架构师",
                children: [
                    {
                        title: "Java架构师"
                    },
                    {
                        title: "JS高级",
                        children: [
                            {
                                title: "ES6"
                            },
                            {
                                title: "动效"
                            }
                        ]
                    },
                    {
                        title: "Web全栈",
                        children: [
                            {
                                title: "Vue训练营",
                                expand: true,
                                children: [
                                    {
                                        title: "组件化"
                                    },
                                    {
                                        title: "源码"
                                    },
                                    {
                                        title: "docker部署"
                                    }]
                            },
                            {
                                title: "React",
                                children: [
                                    {
                                        title: "JSX"
                                    },
                                    {
                                        title: "虚拟DOM"
                                    }
                                ]
                            },
                            {
                                title: "Node"
                            }
                        ]
                    }
                ]
            }
        }
    },
    components: { 
        TItem
    }
}
</script>
<style scoped>
.item {
 text-align: left;
}
</style>
```
---
title: Vue源码分析三
date: 2019-11-22 17:03:28
tags:
---
# 节点属性更新
属性相关dom操作:将属性相关dom操作按hooks归类,在patchVnode时一起执行.
```js
// 定义钩子数组
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
   // 平台特别节点操作、属性更新对象
   const { modules, nodeOps } = backend
    for (i = 0; i < hooks.length; ++i) {
       // 指定到cbs对象上:cbs.create = []
       cbs[hooks[i]] = []
       for (j = 0; j < modules.length; ++j) {
           if (isDef(modules[j][hooks[i]])) {
               // 添加到相应数组中:
               // cbs.create = [fn1,fn2,...]
               // cbs.update = [fn1,fn2,...]
               cbs[hooks[i]].push(modules[j][hooks[i]])
            }
        }
    }
   
    function patchVnode (...) {
        if (isDef(data) && isPatchable(vnode)) {
            // 执行默认的钩子
            for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
            // 执行用户定义的钩子
            if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
        }
    }
}
```
# 组件化机制
```html
<div id="demo">
   <h1>Vue组件化机制</h1>
   <comp></comp>
</div>
<script>
   Vue.component('comp', {
       template: '<div>I am comp</div>'
 
})
</script>
```

## 组件声明
* src/core/global-api/assets.js
Vue.component()或者components选项
initAssetRegister(Vue)
```js
export function initAssetRegisters (Vue: GlobalAPI) {
    // 'component', 'directive', 'filter'
    ASSET_TYPES.forEach(type => {
        // Vue['component']
        Vue[type] = function (
            id: string,
            definition: Function | Object
        ): Function | Object | void {
            // 组件注册
            if (type === 'component' && isPlainObject(definition)) {
                definition.name = definition.name || id
                // 使用extend方法,将传入组件配置转换为构造函数VueComponent
                definition = this.options._base.extend(definition)
            }
            // Vue.options['components']['comp'] = VueComponent
            this.options[type + 's'][id] = definition
            return definition
        }
    })
}
```

## 创建根组件:
首先创建的是根组件,首次_render()时,会得到整棵树的VNode结构.

_createElement src\core\vdom\create-element.js
_createElement实际执行VNode创建的函数,由于传入tag是非保留标签,因此判定为自定义组件通过createComponent去创建
```js
// 获取tag对应的组件构造函数
else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options,'components', tag))) {
    // 使用createComponent创建vnode
   vnode = createComponent(Ctor, data, context, children, tag)
}
```
* src/core/vdom/create-component.js
createComponent()
创建组件VNode,保存了上一步处理得到的组件构造函数,props,事件等
 
 * core/vdom/patch.js
创建自定义组件实例 createEle() 
首次执行_update()时,patch()会通过createEle()创建根元素,子元素创建研究从这里开始
 
* core/vdom/patch.js
createComponent() 自定义组件创建
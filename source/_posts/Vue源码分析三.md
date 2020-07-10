---
title: Vue源码分析三
date: 2019-11-22 17:03:28
tags:
---
# 节点属性更新
属性相关dom操作:将属性相关dom操作按hooks归类,在patchVnode时一起执行。
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
        // ...
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
1. 先使用Vue.component()声明comp组件构造函数,会返回VueComponent实例，它是继承于Vue的。
2. 然后全局配置选项中添加一个components：{comp: Comp}，这个组件就能被全局使用。
3. 先创建父组件，再去挂载。顺序是创建从上往下，挂载从下往上。子组件全部挂载完之后，再去将一整个渲染出来。
```html
<div id="demo">
   <h1>Vue组件化机制</h1>
   <comp></comp>
</div>
<script>
    Vue.component('Comp', {
       template: '<div>I am comp</div>'
    })
    new Vue({
        components: {
            comp: Comp
        }
    })
</script>
```

## 组件声明
### src/core/global-api/assets.js
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
### src/core/vdom/create-component.js
createComponent()
创建组件VNode,保存了上一步处理得到的组件构造函数,props,事件等
 
### core/vdom/patch.js
创建自定义组件实例 createEle() 
首次执行_update()时,patch()会通过createEle()创建根元素,子元素创建研究从这里开始
 
### core/vdom/patch.js
createComponent() 自定义组件创建

# 模板编译
模板编译的主要目标是**将模板(template)转换为渲染函数(render)**
<img src="/static/img/template.png">

## 模板编译必要性
Vue 2.0需要用到VNode描述视图以及各种交互，用户只需要编写类似HTML代码的Vue模板，通过编译器将模板转换为可返回VNode的render函数。

## 体验模板编译
带编译器的版本,可以使用template或el的方式声明模板

```html
<div id="demo">
   <h1>Vue模板编译</h1>
   <p>{{foo}}</p>
   <comp></comp>
</div>
<script>
   Vue.component('comp', {
       template: '<div>I am comp</div>'
 
    })
   // 创建实例
   const app = new Vue({
       el: '#demo',
       data: {foo:'foo'}
 
    });
   // 输出render函数
   console.log(app.$options.render);
</script>

```

```javascript
(function anonymous() {
with(this){return _c('div',{attrs:{"id":"demo"}},[
   _c('h1',[_v("Vue模板编译")]),_v(" "),_c('p',[_v(_s(foo))]),_v(" "),
   _c('comp',{attrs:{"foo":"foo","bar":foo}})],1)}
})
/*  "with(this){return _c('div',{attrs:{"id":"demo"}},[_m(0),_v(" "),_c('p',
    [_v(_s(foo))]),_v(" "),_c('comp',{attrs:{"foo":"foo","bar":foo}})],1)}"
    new Function(str) 将上面的函数字符串放入函数，将字符串变成真正的函数。
*/
```

> _c  返回vnode, createElement
> _v  创建文本节点
> _s  格式化函数
> 其他helpers: core/instance/render-helper/index

## 整体流程
### compileToFunctions
若指定template或el选项,则会执行编译(platforms/web/entry-runtime-with-compiler.js)

```js
const { render, staticRenderFns } = compileToFunctions(template, {}, this)
```

### 编译过程
src/compiler/index.js

```js
export const createCompiler = createCompilerCreator(function baseCompile (
 template: string,
 options: CompilerOptions
): CompiledResult {
 // 解析模板parse                                                 
 const ast = parse(template.trim(), options)
 if (options.optimize !== false) {
   optimize(ast, options) // 优化optimize
}
 // 代码生成generate
 const code = generate(ast, options)
 return {
   ast,
   render: code.render,
   staticRenderFns: code.staticRenderFns
}
})
```
## 模板编译过程
实现模板编译共有三个阶段: 解析, 优化, 生成

### 解析 - parse
解析器将模板解析为抽象语法树AST,只有将模板解析成AST后,才能基于它做优化或者生成代码字符串.
查看得到的AST, /src/compiler/parse/index.js 结构如下:
<img src="/static/img/template2.png">

解析器内部分为HTML解析器,文本解析器和过滤解析器,最主要的是HTML解析器,核心算法说明:
```js
//src/compiler/parser/index.js
parseHTML(tempalte, {
   start(tag, attrs, unary){}, // 遇到开始标签的处理
   end(){},// 遇到结束标签的处理
   chars(text){},// 遇到文本标签的处理
   comment(text){}// 遇到注释标签的处理
})
```
### 优化 - optimize
优化器的作用是在AST中找出静态子树并打上标记.静态子树是在AST中永远不变的节点,如纯文本节点.

标记静态子树的好处:
1. 每次重新渲染,不需要为静态子树创建新节点.
2. 虚拟DOM中patch时,可以跳过静态子树.

测试代码
```html
<!-- 要出现嵌套关系 -->
<h1>Vue<span>模板编译</span></h1>
```
代码实现: src/compiler/optimizer.js - optimize
标记结束:
<img src="/static/img/template3.png">

### 代码生成 - generate
将AST转换成渲染函数中的内容,即代码字符串
generate方法生成渲染函数代码 : src/compiler/codegen/index.js

## v-if, v-for
着重观察几个结构性指令的解析过程
```html
<p v-if="foo">{{foo}}</p>
```
解析v-if: parse/index.js
代码生成: codegen/index.js
```js
"with(this){return _c('div',{attrs:{"id":"demo"}},[
_m(0),_v(" "),
(foo)?_c('p',[_v(_s(foo))]):_e(),_v(" "),_c('comp',{attrs:{"foo":"foo","bar":foo}})],1)}"
```
解析结果:
<img src="/static/img/template4.png">

v-if,v-for这些指令只能在编译器阶段处理,如果我们要在render函数处理条件或循环只能使用js的if和for
```js
Vue.component('comp', {
props: ['foo'],
render(h) { // 渲染内容跟foo的值挂钩,只能用if语句
  if (this.foo=='foo') {
      return h('div', 'foo')
  }
  return h('div', 'bar')
}
})
```
# 总结
## 组件化
1. 组件声明,注册
initAssetRegister(Vue)
生成组件构造函数: VueComponent Vue.extend(opts)
注册组件: Vue.options.components
2. 组件实例化及挂载
new Vue 根组件创建, _render() => VNode
_createElement 获取子组件构造函数并创建
```js
Ctor = resolveAsset(context.$options,'components',tag)
vnode = createComponent(Ctor)
```
createComponent() : 添加初始化钩子
vm._update() => patch() => createElm()
调用子组件初始化钩子
3. 编译原理: template => render()
* 解析parse: 转换字符串模板为AST,解析DOM结构及其中表达式,指令等
* 优化optimize: 标记不发生变化的节点为静态节点和静态根节点,将来可以跳过他们的patch过程起到优化的作用
* 生成generate: 将AST转换为渲染函数的代码字符串
* 编译器获取整体流程
1. 编译template为render
```js
compileToFunctions(template, { }, this)
```
2. compileToFunctions是createCompiler(baseOptions)返回结果
3. createCompiler是
```js
export const createCompiler = createCompilerCreator(function
baseCompile (
 template: string,
 options: CompilerOptions
): CompiledResult {})
```
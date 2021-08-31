# Vue 3.0 概括
## Vue3.0 带来的提升性能提升
打包大小减少40%
初次渲染快55%，更新渲染快133%
内存减少54%

## 源码升级
* 使用Proxy代替defineProperty实现响应式
* 重写虚拟DOM的实现和 Tree Shaking

## 拥抱TypeScript
Vue3更好的支持TypeScript

## 新特性
1. Composition API(组合api)
2. 新的内置组件(Fragment,Teleport, Suspense)
3. 其他改变

# 新建Vue项目
## 使用最新 vue-cli 选择安装 vue 3.0, 创建vue项目
## 使用vite构建工具创建vue3.0项目
### vite构建的优势
* 热模块HMR跟新速度极快。
* 使用rollup打包代码，输出用于生产环境的高度优化过的静态资源。
* 开箱即用的配置

# Api学习
# setup函数
# ref函数定义响应式的数据
接受的数据可以是: 基础数据类型，引用类型（对象，数组）
基础数据类型的数据：返回的是RefImpl的实例，其内部实现还是基于Object。defineProperty()的get，set。因此需要通过.value获取值
引用类型的数据：返回的也是RefImpl的实例，但其内部的属性的响应式基于Proxy。 获取子属性时，不需要.value。

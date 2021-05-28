# React 原理
## 性能瓶颈分析
CPU瓶颈：大量计算，渲染视图
IO瓶颈：异步请求耗时
## 浏览器渲染机制
主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。JS可以操作DOM，GUI渲染线程与JS线程是互斥的。JS脚本执行和浏览器布局、绘制不能同时执行。

每一帧的时间内，浏览器会去执行js脚本，样式布局，样式绘制。

React利用浏览器在每一帧预留给js线程的时间去更新组件。将长任务拆分到每一帧中，每一次执行一小段任务，这样浏览器就有剩余时间执行样式布局和样式绘制，减少掉帧的可能性。这种方式也叫时间切片。

## CPU瓶颈解决
解决CPU瓶颈的关键是实现时间切片，而时间切片的关键是：将同步的更新变为可中断的异步更新。

## IO瓶颈解决
减少网络请求带来的延迟感，先在当前页面停留了一小段时间，这一小段时间被用来请求数据。当“这一小段时间”足够短时，用户是无感知的。如果请求时间超过一个范围，再显示loading的效果。

React为了支持这些特性，同样需要将同步的更新变为可中断的异步更新。

## 老的React架构

## 新的React架构
### Scheduler(调度器)
### Reconciler(协调器)
### Renderer(渲染器)
## Fiber架构
### 实现原理
React使用“双缓存”来完成Fiber树的构建与替换——对应着DOM树的创建与更新。在内存中构建并直接替换的技术叫做双缓存。
#### 双缓存Fiber树
React中最多同时存在两棵Fiber树，当前屏幕上显示内容对应的Fiber树称为current Fiber树，正在内存中构建的Fiber树称为workInProgress Fiber树。

- Reconciler工作的阶段被称为render阶段。因为在该阶段会调用组件的render方法。
- Renderer工作的阶段被称为commit阶段。就像你完成一个需求的编码后执行git commit提交代码。commit阶段会把render阶段提交的信息渲染在页面上。
- render与commit阶段统称为work，即React在工作中。相对应的，如果任务正在Scheduler内调度，就不属于work。

## 源码文件结构
主要文件夹
- fixtures  小型react测试项目
- packages  元数据package.json和React库中所有包的源代码
- scripts   各种工具链脚本，git，jest，eslint

主要关注packages目录
### packages目录
#### react文件夹
React的核心，包含所有全局 React API，如：
- React.createElement
- React.Component
- React.Children

这些api是平台通用的，不包含ReactDOM,ReactNatived等特定平台的代码。
#### scheduler文件夹
Scheduler调度器的实现。
#### shared文件夹
源码中其他模块公用的方法和全局变量

#### react-reconciler文件夹
重点关注react-reconciler，它一边对接Scheduler，一边对接不同平台的Renderer，构成了整个 React16 的架构体系。
---
title: React高级
date: 2020-06-20 16:00:39
tags:
---
# Hook
Hook是一个特殊函数，它可以钩入React特性，useState允许在React函数组件中添加state的Hook。

## 使用Effect Hook 和 state Hook
useSate可以添加state，useEffect可以在函数组件中执行副作用操作。
数据获取，设置订阅以及手动更改React组件中的DOM都属于副作用。 

默认情况下，useEffect会在每轮组件渲染完成后执行。一旦 eﬀect 的依赖发⽣生变化，它就会被重新创建。
useEffect 的第二个参数就表示依赖于这个变量的值，它改变了才会重新执行这个副作用函数里面的代码。
如果这个参数是空数组[]，则useEffect只会执行一次。
```js
import React, { useState, useEffect } from 'react'

export default function HookPage(props) {
    // 使用useState 创建state：count，初始化值为0，改变count的方法
    const [count, setCount] = useState(0)
    const [date, setDate] = useState(new Date())

    // 与componentDidMount 和componentDidUpdate相似
   
    useEffect(() => {
        document.title = `You click ${count} times`
    }, [count])
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000)
        // 组件卸载时需要清楚effect创建的订阅或计时器ID等资源，需要返回一个清除函数，清除函数会在组件卸载前执行。
        return () => {
            clearInterval(timer)
        }
    }, [])
    return (
        <div>
            <h3>Hook page</h3>
            <p>{count}</p>
            <button onClick={() => setCount(count+1)}>add</button>
            <p>{date.toLocaleTimeString()}</p>
        </div>
    )
}
```

## 自定义Hook
使用自定义Hook，在组件之间重用一些状态逻辑。
自定义Hook是一个函数，其名称必须以'use'开头，函数内部可以调用其他的Hook。
```js
function useClock() {
    const [date, setDate] = useState(new Date())
    useEffect(() => {
        console.log("date effect")
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])
    return date
}
```
## Hook使用规则
Hook就是JavaScript函数，但是使用它们会有两个额外的规则：
1. 只能在函数最外层调用Hook，不能在循环，条件或者子函数中使用。
2. 只能在React的函数组件中和自定义的Hook中可以调用Hook，不要在其它的JavaScript函数中调用。

## useMemo 和 useCallback
类比Vue中的计算属性，只有在依赖项的数据变化时，才执行函数，具有缓存的作用。
useCallback是useMemo的变体：useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。
```js
// useMemo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
// useCallback
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
)
```
# React VS CODE 插件
## 处理HTML标签
Auto Close Tag
Auto Complete Tag
Auto Raname Tag
Auto Import
HTML Format

## 处理CSS
Beautify css/sass/scss/less
## 处理注释
Better Comments
## 代码检查
ESLint
## 浏览器打开
open in browser
## 代码格式化
Prettier-Code formatter
## React 代码快捷方式
React-Native/React/Redux snippets for es6/es7

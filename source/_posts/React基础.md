---
title: React基础
date: 2020-06-16 14:40:10
tags:
---

# React
React是一个用于构建用户界面的JavaScript库。
## 构建React应用
使用Create React App创建React应用。
npx 是npm5.2+附带的package运行工具

1. 创建项目：npx create-react-app my-app
2. 进入项目：cd my-app
3. 启动项目： npm start
4. 暴露配置项： npm run eject (执行这行命令之后，就会暴露出config文件夹，其中包括webpack.config.js)
## React应用文件结构
```
├── README.md                     文档
├── public                        静态资源
│   ├── favicon.ico
│   ├── index.html                打包之后的文件会以script标签的形式插入index.html
│   └── manifest.json
└── src                           源码
    ├── App.css
    ├── App.js                    根组件
    ├── App.test.js              
    ├── index.css                 全局样式
    ├── index.js                  ⼊⼝⽂件 （webpack要打包处理的入口文件）
    ├── logo.svg
    └── serviceWorker.js          pwa⽀持
├── package.json                  npm包依赖
```
入口文件定义的位置，/config/webpack.config.js
```js
entry: [
    // WebpackDevServer客户端，它实现开发时热更更新功能
    isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
    // 应用程序入口： src/index.js
    paths.appIndexJs,
].filter(Boolean)
```

webpack.config.js是webpack配置文件，开头的常量声明可以看出React app能够支持ts,sass以及css模块化.
```js
// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
```
## React 和 ReactDom
React 负责逻辑控制，将数据转化成VDOM
ReactDom 负责渲染，将VDOM渲染成真是DOM
React中使用JSX来描述UI。babel-loader把JSX编译成JS对象，React.crreteElement()再把这个JS对象构造成React的VDOM。
```js
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';

const JSX = <h1>Hello React</h1>

ReactDOM.render(
  JSX,
  document.getElementById('root')
);
```
# JSX语法
JSX是一种JavaScript的语法扩展，其格式像模板语言，但实际上完全实在JavaScript内部实现。JSX可以很好地描述UI，能够有效提高开发效率。
## 基本使用
{}用来包裹表达式，其内部的表达式会被计算出来。
### 变量
```js
const name = 'react'
const jsx = <div>hello, { name }</div>
```

### 函数
```js
const obj = {
    firstName: 'Harry',
    lastName: 'Potter'
}
function formatName(v) {
    return v.firstName + ' ' + v.lastName
}
const jsx = <div>{ formatName(obj) }</div>
```
### 对象
jsx也是js对象，也是合法的表达式
```js
const greet = <div>good</div>
const jsx = <div>{greet}</div>
```
### 条件语句
```js
const show = true
const greet = <div>good</div>
const jsx = (
    <div>
        { show ？greet : "bad" }
        { show && greet }
    </div>
)
```

### 数组
数组会被作为一组子元素对待，数组中存放一组jsx可用于现实列表数据。
```js
// 在diff的时候先比较标签type，然后是key，所以同级元素的key必须是唯一的
const a = [1, 2, 3]
const jsx = (
    <div>
        <ul>
            { a.map(item => (<li key={ item }>{ item }</li>))}
        </ul>
    </div>
)
```

### 属性上使用{}
属性：静态值使用双引号，动态值使用花括号，双花括号里面的花括号用来表示对象的。
```js
import logo from './logo.svg'

const jsx = (
    <div>
        <img src={logo} style={{ width: 100px}} className="img" />
    </div>
)
```

### css模块化
```js
// CSS模块化规则：http://www.ruanyifeng.com/blog/2016/06/css_modules.html
import style from './index.module.css'
<img className={style.logo}>
```
# 组件
组件，类似于JavaScript函数。它接受任意的参数(props),并返回描述页面展示内容的React元素。
组件有两种形式：class组件和function组件。
## Class组件
class组件拥有状态和生命周期，继承于Component，定义render方法。
```js
import React, { Component } from 'react'
export default class ClassComponent extends React.Component {
    constructor(props) {
        super(props)
        // 使用state属性维护状态，在构造函数中初始化状态
        this.state = {
            date: new Date()
        }
    }
    // 生命周期钩子函数， 挂载之后执行
    componentDidMount() {
        // 组件挂载之后启动定时每秒更新状态
        this.timer = setInterval(() => {
            // 使用setState方法更新状态
            this.setState({date: new Date()})
        }, 1000)
    }
    // 生命周期钩子函数，在组件卸载之前停止定时器
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    // 生命周期钩子函数， 在组件更新后调用
    componentDidUpdate() {
        console.log(" component did update")
    }
    // 必须有这个render函数，将来会返回jsx
    render() {
        return <div>{this.state.date.toLocaleTimeString()}</div>
    }
}
```
## function组件
函数组件通常无状态，仅关注内容展示，返回渲染结果即可。
从React16.8开始引入hooks, 函数组件也能够拥有状态。
可以把useEffect Hook看作是componentDidMount,componentWillUnmount和componentDidUpdate这三个函数的结合。
```js
import React, { useState, useEffect } from 'react'

export function FunctionComponent(props) {
    // 声明状态 和 要改变状态的函数
    const [date, setDate] = useState(new Date())
    useEffect(() => {
        // 副作用，当组件挂载之后执行，对应class component中的生命周期钩子函数-componentDidMount()
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000)
        // 组件卸载的时候执行，对应class component 中的生命周期钩子函数-componentWillUnmount()
        return () => clearInterval(timer)
    }, []) // []数组中放依赖项表示，谁的值改变了就执行了回调函数，空数组表示，谁的值变了都不重新执行回调函数。
    return (
        <div>
            <h3>Function component</h3>
            <p>{ date.toLocaleTimeString()}</p>
        </div>
    )
}

```
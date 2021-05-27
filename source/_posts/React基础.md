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

1. 创建项目：npx create-react-app my-app (安装npm install -g create-react-app)
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
React 负责逻辑控制，将数据转化成VDOM。
ReactDom 负责渲染，将VDOM渲染成真实DOM。
React中使用JSX来描述UI。babel-loader把JSX编译成JS对象，React.crreteElement()再把这个JS对象构造成React的VDOM。

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

const JSX = <h1>Hello React</h1>
// ReactDOM.render() 是 React 的最基本方法，用于将jsx转换为 HTML ，并插入指定的 DOM 节点。
// 下列代码 将h1元素插入root节点。
ReactDOM.render(
  JSX,
  document.getElementById('root')
);
```
# JSX语法
JSX 就是 javaScript 的扩展，允许 HTML 和 javaScript 混写。
JSX 基本语法规则：遇到HTML标签，就是用HTML规则解析，遇到代码块（{}包裹）就是用JavaScript规则解析。
## 基本使用
{}用来包裹表达式，其内部的表达式会被计算出来。只有字符串才需要使用引号''包裹，其余情况都不需要在jsx内部使用引号。
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
数组会被作为一组子元素对待，jsx会隐式地拼接数组地所有元素，然后将其添加到模板。
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
属性：字符串使用双引号，js表达式使用花括号，双花括号里面的花括号用来表示对象的，外部的花括号是用来包裹代码块的。
```js
import logo from './logo.svg'

const jsx = (
    <div>
        <img src={logo} style={{ width: 100px}} className="img" />
    </div>
)
```
### props
react组件通过props获取传递进来的参数
```js
class HelloMessage extends React.Component {
  render() {
    return <div>
      <h1>Hello {this.props.name}</h1>
      <p>some text</p>
    </div>;
  }
}

ReactDOM.render(
  <HelloMessage name="coke" />,
  document.getElementById('example')
);

```
this.props.children获取传递进来的子组件，如果没有子组件该属性值为undefined，如果是1个子组件为对象，多个子组件为数组。
React.Children.map来处理this.props.children 就不用考虑它的数据结构，内部做了处理。
```js
class NotesList extends React.Component {
  render() {
    return (
      <ol>
      {
        React.Children.map(this.props.children, function (child) {
          return <li>{child}</li>;
        })
      }
      </ol>
    );
  }
}

ReactDOM.render(
  <NotesList>
    <span>hello</span>
    <span>world</span>
  </NotesList>,
  document.getElementById('example')
);
```
设置默认的props，并且限制props属性的数据类型
```js
import PropTypes from 'prop-types';
class MyTitle extends React.Component {
    static defaultProps  = {
        title: 'Hello World',
    }
    static propTypes = {
        title: PropTypes.string.isRequired,
    }
    render() {
        return <h1> {this.props.title} </h1>;
    }
}
```
### ref获取元素结点
创建一个引用对象，通过属性current保存绑定的元素。
```js
export default class MyComponent extends React.Component{
  constructor(props) {
    super(props);
    this.myTextInput = React.createRef();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.myTextInput.current.focus();
  }
  render() {
    return (<div>
      <input type="text" ref={this.myTextInput} />
      <input type="button" value="Focus the text input" onClick={this.handleClick} />
    </div>)
  }
}
```
### 设置状态和更新状态
组件内的数据通过state声明，数据完全是组件私有的，必须使用this.setState()更新组件内的数据，然后内部会调用render()方法重新渲染组件，更新DOM。

特性：单向数据流，数据向下流动。
```js
export default class MyStateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    // 更新数据
    this.setState({ liked: !this.state.liked });
  }
  render() {
    const text = this.state.liked ? "like" : "dislike";
    return <p onClick={this.handleClick}>You {text} this. clike to toggle.</p>;
  }
}
```
注意：
- 不要直接修改state, 这样不会重新渲染组件。
- state的更新可能是异步的，这取决于是否依赖了props或state中的其他值，因为这些值，会异步更新，React会把多个setState调用合并成一个调用。
- 由React控制的事件处理程序，以及生命周期函数调用setState异步更新state。大部分开发中用到的都是React封装的事件，比如onChange、onClick、onTouchMove等，这些事件处理程序中的setState都是异步处理的。
- React控制之外的事件中调用setState是同步更新的。比如原生js绑定的事件，setTimeout/setInterval等。
```js
// 错误
this.setState({
  counter: this.state.counter + this.props.increment,
});
// 正确 写成函数，为了获取最近一次的数据
// 让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：
this.setState((state, props) => ({
    counter: state.counter + props.increment
}))
```
### 数据响应式
处理表单数据，实现响应式
```js
export default class MyDataResponse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "hello",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    let value = this.state.value;
    return (
      <div>
        <input type="text" value={value} onChange={this.handleChange} />
        <p>{value}</p>
      </div>
    );
  }
}
```
### css模块化
```js
// CSS模块化规则：http://www.ruanyifeng.com/blog/2016/06/css_modules.html
import style from './index.module.css'
<img className={style.logo}>
```


# 组件
React组件，类似于JavaScript函数。它接受任意的参数(props),并返回描述页面展示内容的React元素。

组件有两种形式：class组件和function组件。

props: 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象被称之为 “props”。
可以通过this.props访问自定义组件接收的属性和子组件（通过children属性获取子组件）。
组件名称必须以大写字母开头，小写字母开头的组件将会被视为原生DOM标签。
## Class组件
class组件拥有状态和生命周期，继承于React.Component，必须定义render方法，render方法返回该class组件地实例。组件内的子元素必须被一个顶级的标签元素包裹。
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

export default function FunctionComponent(props) {
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
## 生命周期
React 生命周期主要分为三个阶段：挂载阶段（Mount）,更新阶段（Update），卸载阶段（Unmount）
### 组件的生命周期
每个组件都包含"生命周期方法"，重写生命周期方法，会在组件运行的特别阶段执行这些方法。
React 16.3之前的生命周期函数图
<img src="/static/img/react1.png" />
React 16.4之后的生命周期函数图
<img src="/static/img/react2.png" />

React 17即将废除的三个生命周期函数：
* componentWillMount()
* componentWillReceiveProps()
* componentWillUpdate()

可以替代的两个新的生命周期函数：
* static getDerivedStateFromProps()
* getSnapshotBeforeUpdate()
如果要使用即将废除的生命周期函数，需要加上前缀'UNSAFE_', 或这运行如下命令，自动加前缀。
```
cd your_project
npx react-codemod rename-unsafe-lifecycles
```
#### 挂载相关
当组件实例被创建并插入DOM中时，其生命周期调用顺序如下：
* constructor()
* static getDerivedStateFromProps()
* render()
* componentDidMount()

#### 更新相关
当组件的porps或state发生变化时会触发更新。组件更新的生命周期调用顺序如下：
* static getDerivedStateFromProps()
* shouldComponentUpdate()
* render()
* getSnapshotBeforeUpdate()
* componentDidUpdate()
#### 卸载相关
当组件从DOM中移除时会调用如下方法：
* componentWillUnmount()
#### 错误处理相关
当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：
* static getDerivedStateFromError()
* componentDidCatch()

#### LifeCycle
```js
import React, { Component } from 'react'
import PropTypes from 'prop-types' // react内置库，用于对props做类型检查
import Child from './Child'

export default class Lifecyclepage extends Component {
    // 设置静态属性defaultProps 作为 props的默认值
    static defaultProps = {
        msg: 'omg'
    }
    // 设置静态属性propTypes，规定props的值的类型。
    static propTypes = {
        msg: PropTypes.string.isRequired
    }
    /**
     * 
     * @constructor 构造函数
     * 如果构造React.Component的子组件，则必须使用super(props)
     * 在构造函数中，只做两件事:
     *      1. state初始化
     *      2. 给事件处理函数绑定当前实例：this.handleClick = this.handleClick.bind(this);
     * 如果不做上述的事情，constructor函数是不需要声明的，super默认会去执行。
     */
    constructor(props) {
        super(props) 
        this.state = {
            count: 0
        }
        console.log('constructor', this.state.count)
    }
    /**
     * @getDerivedStateFromProps 
     * 作用： 更新state
     * 时机： 在调用render方法之前调用，在第一次挂载和后续更新都会被调用。（每次渲染前触发此方法）
     * 用法： 返回一个对象来更新state，如果返回null，不更新任何内容。
     */
    static getDerivedStateFromProps(props, state) {
        const { count } = state
        console.log('getDerivedStateFromProps', count)
        return count < 5 ? null : { count: 0 }
    }
    /*
      
    UNSAFE_componentWillReceiveProps(nextProps) {
        // 不推荐，将会被废弃
        // UNSAFE_componentWillReceiveProps() 会在已挂载的组件接收新的 props 之前被调用
        console.log("Foo componentWillReceiveProps");
    }
    */
    
    /**
     * @getSnapshotBeforeUpdate
     * 作用：   它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）
     * 时机：   在render之后，在componentDidUpdate之前。
     * 用法：   此生命周期的任何返回值将作为参数传递给 componentDidUpdate(prevProps, prevState, snapshot)。应返回 snapshot 的值（或 null）。
     */
    getSnapshotBeforeUpdate = (prevProps, prevState) => {
        const { count } = prevState
        console.log('getSnapshotBeforeUpdate', count)
        return null
    }
    /* 
    UNSAFE_componentWillMount() {    
        //不推荐，将会被废弃    
        console.log("componentWillMount", this.state.count);  
    } 
    */

    /**
     * @componentDidMount
     * 作用：   发起网络请求获取数据，添加订阅。 
     * 时机：   会在组件挂载后（插入DOM树中，也就是render执行后）立即调用。
     * 用法：   在此函数里可以直接调用setState，会触发额外的渲染，此渲染会发生在浏览器更新屏幕之前。
     * 注意：   谨慎使用，会导致性能问题。
     */
    componentDidMount() {
        console.log('componentDidMount', this.state.count)
    }
    /**
     * @componentWillUnmount
     * 作用:    执行清理操作，如timer，取消网络请求，取消订阅
     * 时机：   在组件卸载及销毁之前直接调用。
     * 用法：   不能使用setState,组件实例卸载后，将不会再挂载它。
     */
    componentWillUnmount() {
        console.log('componentWillUnmount', this.state.count)
    }
    /* 
    UNSAFE_componentWillUpdate() {    
        // 不推荐，将会被废弃    
        console.log("componentWillUpdate", this.state.count);
      }
    */

    /**
     * @componentDidUpdate
     * 作用：   当组件更新后，可以在此处对DOM进行操作
     * 时机：   在更新后会被立即调用，首次渲染不会执行此方法。
     * 用法：   对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。
     * 注意1：  可以使用setState,它必须被包裹在一个条件语句里,否则会导致死循环。它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。
     * 注意2：  shouldComponentUpdate返回值为false，则不会调用该方法。
     * 注意3：  getSnapshotBeforeUpdate的返回值将作为该方法的第三个参数snapshot。  
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate', this.state.count)
    }
    /**
     * @shouldComponentUpdate
     * 作用：   默认行为state每次发生变化，组件都会重新渲染，根据该函数的返回值，判断组件的输出是否受当前state或props更改的影响。
     * 时机：   首次渲染或使用 forceUpdate() 时不会调用该方法。当props和state变化时，在render前被调用。
     * 用法：   返回值默认为true，返回false则不会调用 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()。
     * 注意：   返回 false 并不会阻止子组件在 state 更改时重新渲染。
     */
    shouldComponentUpdate(nextProps, nextState) {
        const { count } = nextState
        console.log('shouldCOmponentUpdate', count, nextState.count)
        return count !== 3
    }

    setCount = () => {
        this.setState({
            count: this.state.count + 1
        })
    }
    /**
     * @render
     * 作用：   返回由JSX创建的React元素
     * 时机：   constructor执行之后
     * 用法：   保持render函数为纯函数，不与浏览器交互。与浏览器进行交互，请在 componentDidMount
     * 注意：   如果 shouldComponentUpdate() 返回 false，则不会调用 render()
     */
    render() {
        const { count } = this.state
        console.log('render', this.state)
        return (
            <div>
                <h1>Life cycle page</h1>
                <p>{ count }</p>
                <button onClick={this.setCount}>改变count</button>
            </div>
        )
    }
}
```

## 组合组件
React推荐使用组合而非继承来实现组件间的代码重用。
### 不具名的方式传入子组件
类比Vue中的slot插槽的不具名插槽。
```js
function Component(props) {
    // children 为插入该组件的子组件
    const { children } = props
    return (
        <div>
            { children }
            { children.content }
            { children.txt}
        </div>
    )
}

function RootComponent() {
    return (
        <Component>
            {/* 这个组件里面的内容全部会被作为 默认的children组件 */}
            <h1>Welcome</h1>
            <p>Richard!</p>
        </Component>
    )
}
```

### 具名的方式传入子组件
类比Vue中的具名插槽
```js
function RootComponent() {
    return (
            // 不使用children, 自定义传入props的内容
            // 可以将任何东西作为 props 进行传递。
            <Component top={<TopBar />} bottom={<BottomBar />}></Component>
        )
}

function Component(props) {
    // children 为插入该组件的子组件
    const { children } = props
    return (
        // 使用自定义传入的内容
        <div>
            { props.top }
            { props.bottom }
        </div>
    )
}
```

# redux
redux是JavaScript应用的状态容器，提供可预测的状态管理。它保证程序行为一致性且易于测试。
应用场景：
* 有相当大量的，随时变化的数据。
* state需要有一个单一的可靠来源
* state太多，放在顶层组件，不方便维护。
* state需要共享的时候。

## 安装
```
npm install redux --save
```
## 使用
使用步骤：
1. createStore() 创建 store
2. reducer 初始化state和定义修改状态的函数
3. store.getState() 获取状态
4. store.dispatch() 提交对数据的更改
5. store.subscribe() 订阅
创建store
```js
import { createStore } from 'redux'
// state  表示状态
// action 表示方法，用来更改状态。
const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case 'ADD':
            return state + 1
        case 'MINUS':
            return state - 1
        default:
            return state
    }
}
// 创建 store
const store = createStore(counterReducer)
export default store
```
使用store
```js
import React, { Component } from 'react'
import store from '../store/ReduxStore'

export default class ReduxPage extends Component {
    componentDidMount() {
        // 订阅，当state改变就会执行函数
        store.subscribe(() => {
            console.log("subscribe")
            // 强制更新
            this.forceUpdate()
        })
    }
    add = () => {
        store.dispatch({type: "ADD"})
    }
    minus = () => {
        store.dispatch({type: "MINUS"})
    }
    render() {
        console.log("store", store)
        return (
            <div>
                <h3>Redux Page</h3>
                {/* 获取state */}
                <p>{store.getState()}</p>
                <button onClick={ this.add }>add</button>
                <button onClick={ this.minus }>minus</button>
            </div>
        )
    }
}
```
# react-redux
## 安装
```js
npm i react-redux --save
```
## 使用
react-redux提供了两个api
1. Provider为后代组件提供store
2. connect为组件提供数据和变更方法

全局使用store：index.js
```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/index'
import ReactReduxComponent from 'src/components/ReactReduxComponent.js'


render(
  <Provider store={store}>
    <ReactReduxComponent />
  </Provider>,
  document.getElementById('root')
)
```
创建store：store/index.js
```js
import { createStore } from 'redux'

// state  表示状态
// action 表示方法，用来更改状态。
const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case 'ADD':
            return state + 1
        case 'MINUS':
            return state - 1
        default:
            return state
    }
}
// 创建 store
const store = createStore(counterReducer)
export default store
```
使用react-redux的组件：src/components/ReactReduxComponent.js
```js
import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return {
        num: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        add: () => dispatch({type: 'ADD'}),
        minus: () => dispatch({type: 'MINUS'})
    }
}

class ReactReduxPage extends Component {
    render() {
        const { num, add, minus } = this.props
        return (
            <div>
                <h1>React Redux Page</h1>
                <p>{num}</p>
                <button onClick={add}>add</button>
                <button onClick={minus}>minus</button>
            </div>
        )
    }
}
// 状态映射 mapStateToProps
// 派发事件映射 mapDispatchToProps
export default connect(mapStateToProps, mapDispatchToProps)(ReactReduxPage)
```

# react-router
react-router是react的路由库。它通过管理 URL，实现组件的切换和状态的变化。
react-router包含3个库，react-router,react-router-dom和react-router-native。
react-router提供最基本的路由功能，实际使用的时候，不会直接安装react-router。而是根据应用运行的环境选择安装react-router-dom(安装在浏览器使用)或react-router-native(在react native中使用)。
因为在安装时react-router也会安装。
## 安装
```js
npm i react-router-dom --save
```
## 基本使用
react-router中奉行一切皆组件的思想，路由器-Router，链接-link，路由-Route，独占-Switch，重定向-Redirect都是以组件形式存在。
```js
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

export default class RouterPage extends Component {
    render() {
        return (
            <div>
                <h3>Router Page</h3>
                <Router>
                    <Link to="/">首页</Link>
                    <Link to="/user">用户中心</Link>
                    {/** Switch 表示仅匹配路由列表中的一个 */}
                    <Switch>
                        {/**exact 表示实现精确匹配 */}
                        <Route exact path="/" component={HomePage}></Route>
                        <Route 
                            path="/user" 
                            component={UserPage}
                            // children={() => <div>children</div>}
                            // render={() => <div>render<div/>}
                        ></Route>
                        {/* 路由列表最后设置一个path为空的路由，为找不到的资源，匹配404页面 */}
                        <Route component={EmptyPage}></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

class HomePage extends Component {
    render() {
        return (
            <div>
                <h3>HomePage</h3>
            </div>
        )
    }
}
class UserPage extends Component {
    render() {
        return (
            <div>
                <h3>UserPage</h3>
            </div>
        )
    }
}
class EmptyPage extends Component {
    render() {
        return (
            <div>
                <h3>Empty page 404</h3>
            </div>
        )
    }
}
```
## Route渲染内容的三种方式
Route渲染的优先级： children > component > render。三种方式同时应用，也只有一种有效。
* children属性
children属性接受一个函数，不管location是否匹配，都需要渲染一些内容，这时可以使用children。
Switch组件特性会让children属性的路由匹配到，才显示。
* component属性
component属性接受一个component，只有当location匹配的时候渲染。
* render属性
render属性接受一个函数，只有当location匹配的时候渲染。
# PureComponent
继承自PureComponent的组件，会去默认的执行shouldComponentUpdate 方法,去比较state，props，改变了数据才去重新render。并且是以浅层对比prop和state的方式实现该函数。
如果赋予React组件相同的props和state，render会渲染同样的内容，那么使用PureComponent就不会再去渲染，从而提高性能。
注意： PureComponent中的shouldComponentUpdate会跳过所有子组件树的prop更新。只有在数据比较简单的时候使用PureComponent.
```js
import React, { PureComponent } from 'react'

export default class PureComponentPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0
        }
    }
    setCounter = () => {
        this.setState({
            counter: 100
        })
    }
    render() {
        const { counter } = this.state
        console.log('render')
        return (
            <div>
                <h1>PureComponent Page</h1>
                <div onClick={this.setCounter}>counter: {counter}</div>
            </div>
        )
    }
}
```
使用Coomponent来实现PureComponent的效果
```js
import React, { PureComponent } from 'react'

export default class ComponentPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0
        }
    }
    // 自定义shouldComponentUpdate
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.counter !== this.state.counter
    }
    setCounter = () => {
        this.setState({
            counter: 100
        })
    }
    render() {
        const { counter } = this.state
        console.log('render')
        return (
            <div>
                <h1>PureComponent Page</h1>
                <div onClick={this.setCounter}>counter: {counter}</div>
            </div>
        )
    }
}
```

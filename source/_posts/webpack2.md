---
title: webpack2
date: 2020-08-04 22:51:48
tags:
---

# WebpackDevServer
每次改完代码都需要重新打包一次，打开浏览器，刷新一次，很麻烦。可以安装使用WebpackDevServer来改善开发效率。
## 安装
```bash
npm install webpack-dev-server -D
```
## 配置
修改package.json
```js
"script": {
    "server": "webpack-dev-server"
}
```

在webpack.config.js配置
```js
devServer: {
    contentBase: "./dist",
    open: true,
    port: 8081
}
```
## 启动
```bash
npm run server
```
启动服务后，会发现dist目录没有了，这是因为devServer把打包后的模块不会放到dist目录下，而是放到了内存中，从而提升速度。

## 本地mock，解决跨域
联调期间，前后端分离，直接获取数据会跨域，上线后我们使用nginx转发，开发期间，webpack就可以搞定这件事。
```js
// npm i express -D
// 创建一个server.js 修改package.js中的scripts选项 "server":"node server.js"

// server.js
const express = require('express')
const app = express()
app.get('/api/info', (req, res) => {
    res.json({
        name: '开课吧',
        age: 5,
        msg: 'welcome to kkb'
    })
})

app.listen('9092')

// node server.js
// 通过 http://localhost:9092/api/info 获取mock数据
```

## 项目中安装axios工具
```js
// npm i axios -D
// index.js
import axios from 'axios'
// 会有跨域问题
axios.get('http://localhost:9092/api/info').then(res => {
    console.log(res)
})
```

## 修改webpack.config.js设置服务器代理
```js
// 对于/api的请求会转发到http://localhost:9092
devServer: {
    ...
    proxy: {
        "/api": {
            target: "http://localhost:9092"
        }
    }
}
```

## 修改index.js
```js
// 请求/api/info的请求都会代理到webpack的proxy配置中下的地址中。
axios.get("/api/info").then(res => {
    console.log(res)
})
```

# Hot Module Replacement(HMR:热模块替换)
模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。主要是通过以下几种方式，来显著加快开发速度：
1. 保留在完全重新加载页面时丢失的应用程序状态。
2. 只更新变更内容，以节省宝贵的开发时间。
3. 调整样式更加快速，几乎相当于在浏览器调试器中更改样式。

## 启动HMR
注意启动HMR后,css抽离不会生效,还有不支持contenthash, chunkhash。HMR 不适用于生产环境，这意味着它应当只在开发环境使用。
```js
// 配置文件头部引入webpack
const webpack = require('webpack')

// 配置devServer
devServer: {
    contentBase: "./dist",
    open: true,
    hot: true,      // 启用 webpack 的模块热替换特性, 会自动刷新页面。
    hotOnly: true   // 启用 webpack 的模块热替换特性，即便某些模块不支持热更新的情况下，浏览器也不自动刷新页面，而是在控制台输出热更新失败。
}

// 添加插件
plugins: [
    new webpack.HotModuleReplacementPlugin()
]
```

## 处理JS模块HMR
启用 webpack 内置的 HMR插件后, module.hot 接口就会暴露在 index.js 中, 接下来需要在 index.js 中配置告诉 webpack 接受HMR的模块。
需要使用module.hot.accept来观察模块更新，从而更新。
```js
// index.js
import printMe from './print.js'

if (module.hot) {
    module.hot.accept('./print.js', function () {
        ...
        printMe()
    })
}
``` 
# Babel处理ES6
中文网站： https://www.babeljs.cn/

Babel是JavaScript编译器，能将ES6代码转换成ES5代码，让我们开发过程中放心使用JS新特性而不用担心兼容性问题。并且还可以通过插件机制根据需求灵活的扩展。

Babel在执行编译的过程中，会从项目根目录下的.babelrc 文件中读取配置。没有该文件会从loader的options处读取配置。

## 安装
babel-loader是webpack与babel的通信桥梁，不会做把es6转换成es5的工作。
@babel/preset-env 里包含了ES6,7,8转换成ES5的转换规则，由这个包去做转换的工作。
```bash
npm i babel-loader @babel/core @babel/preset-env -D
```
## 配置webpack.config.js
```js
{
    module: {
        rules: [
           {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                   loader: "babel-loader",
                   options: {
                       presets: ["@babel/preset-env"]
                   }
               }
           }
        ]
    },
}
```
通过上面的几步还不够，默认的Babel只支持let等一些基础的特性转换，Promise等一些的转换还需要借助@babel/polyfill,把ES的新特性都装进来，来弥补低版本浏览器中缺失的特性。

## 引入@babel/polyfill
以全局变量的方式注入进来。windows.Promise,它会造成全局对象的污染。
```js
// 安装
npm install -S @babel/polyfill

// 入口文件index.js
import "@babel/polyfill"
```

## 按需加载，减少冗余
引入babel/polyfill后,打包的体积大了很多，这是因为polyfill默认会把所有特性注入进来。然而我们期望只有用到ES6+的特性才会注入，没有用到的特性不注入，从而减少打包的体积。
```js
// 修改webpack.config.js

options: {
    preset: [
        [
            "@babel/preset-env",
            {
                targets: {
                    edge: "17",
                    firefox: "60",
                    chrome: "67",
                    safari: "11.1"
                },
                corejs: 2,            // 新版本需要指定核心版本库
                useBuiltIns: "usage" // 按需注入
            }
        ]
    ]
}
```
useBuiltIns选项是babel 7 的新功能，这个选项告诉babel如何配置@babel/polyfill。它有三个参数可以使用： 
1. entry：需要在webpack的入口文件里import "@babel/polyfill"一次。babel会根据你的使用情况导入垫片,没有使用的功能不会被导入相应的垫片。
2. usage：不需要import，全自动检测，但是要安装@babel/polyfill 。(试验阶段)
3. false: 如果你 import"@babel/polyfill" ,它不会排除掉没有用到的垫片,程序体积会庞大。(不推荐)

请注意: usage 的行为类似 babel-transform-runtime,不会造成全局污染,因此也不会对类似 Array.prototype.includes() 进行 polyfill。

## 使用.babelrc文件
新建.babelrc文件。把options部分移入到该文件中，就可以了。
```js
// .babelrc
{
    preset: [
        [
            "@babel/preset-env",
            {
                targets: {
                    edge: "17",
                    firefox: "60",
                    chrome: "67",
                    safari: "11.1"
                },
                corejs: 2,            // 新版本需要指定核心版本库
                useBuiltIns: "usage" // 按需注入
            }
        ]
    ]
}
// webpack.config.js
{
    test: /\.js$/,
    exclude： /node_modules/,
    loader: "babel-loader"
}
```
## @babel/plugin-transform-runtime
当我们开发的是组件库，工具库这些场景的时候，polyfill就不合适了，因为polyfill是注入到全局变量window下的，会污染全局环境。
所以推荐闭包的方式： 使用@babel/plugin-transform-runtime，它不会造成全局污染。
安装
```bash
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```
修改配置文件： 注释掉之前的presets选项，添加plugins
```js
options: {
    // presets: [
    //     [
    //         "@babel/preset-env",
    //         {
    //             targets: {
    //                 edge: "17",
    //                 firefox: "60",
    //                 chrome: "67",
    //                 safari: "11.1"
    //             },
    //             useBuiltIns: "usage",
    //             corejs: 2
    //         }
    //     ]
    // ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
            }
        ]
    ]
}
```
# 多页面打包通用方案
## webpack.config.js配置文件
```js
entry: {
    index: "./src/index",
    list: "./src/list",
    detail: "./src/detail"
}
new htmlWebpackPlugins({
    title: "index.html",
    template: path.join(__dirname, "./src/index/index.html"),
    filename: "index.html",
    chunks: [index]
})
new htmlWebpackPlugins({
    title: "list.html",
    template: path.join(__dirname, "./src/list/index.html"),
    filename: "list.html",
    chunks: [list]
})
new htmlWebpackPlugins({
    title: "detail.html",
    template: path.join(__dirname, "./src/detail/index.html"),
    filename: "detail.html",
    chunks: [detail]
})
```
## 目录结构调整

```js
src
    index
        index.js
        index.html
    list
        index.js
        index.html
    detail
        index.js
        index.html
```
## 使用嗯glob.sync第三方库来匹配路径
```js
// 安装glob
npm i glob -D
// MPA多页面打包通用方案
// webpack.config.js配置文件
const path = require("path")
const glob = require("glob")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"))
    entryFiles.map((item, index) => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index\.js$/)
        const pageName = match && match[1]
        entry[pageName] = entryFile
        htmlWebpackPlugins.push(new htmlWebpackPlugin({
            title: pageName,
            template: path.join(__dirname, `src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: [pageName],
            inject: true
        }))
    })

    return {
        entry,
        htmlWebpackPlugins
    }
}
const {entry, htmlWebpackPlugins} = setMpa()
module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].js"
    },
    plugins: [
        ...htmlWebpackPlugins // 展开数组
    ]
}
```
# 文件监听
轮询判断文件的最后编辑时间是否变化，某个文件发生了变化，并不会立刻告诉监听者，先缓存起来。
webpack开启监听模式的两种方式：
1. 命令行形式，启动监听后，需要手动刷新浏览器
```js
scripts: {
    "watch": "webpack --watch"
}
```
2. 在配置文件里设置
```js
watch：true, // 默认为false，不开启
watchOptions： {
    ignored: /node_modules/, // 默认为空，不监听的文件或目录，支持正则
    aggregateTimeout：300, // 监听到文件变化后，等300ms再去执行，默认300ms
    poll: 1000  // 判断文件是否发生变化是通过不停的询问系统指定文件有没有变化，默认每1000ms问一次
}
```

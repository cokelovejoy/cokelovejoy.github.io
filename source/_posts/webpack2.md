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
proxy: {
    "/api": {
        target: "http://localhost:9092"
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
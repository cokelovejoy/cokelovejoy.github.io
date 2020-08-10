---
title: webpack
date: 2020-07-23 13:54:04
tags:
---

# webpack 
webpack is a module bundler(模块打包工具)，它会从入口模块出发，识别出源码中的模块导入语句，递归找出入口文件的所有依赖，将入口和其所有的依赖打包到一个单独的文件中。是工程化，自动化思想在前端开发中的体现。
# 环境准备
nodejs，版本参考官网发布的最新版本，可以提升webpack的打包速度。
# 安装webpack
推荐项目安装，不要全局安装，全局安装webpack，这会将你项目中的webpack锁定到指定版本，造成不同的项目中因为webpack依赖不同版本⽽而导致冲突，构建失败。
```bash
# 安装最新稳定版本
npm i -D webpack

# 安装指定版本
npm i -D webpack@<version>

# 安装最新的体验版本
npm i -D webpack@beta

# 安装webpack V4+版本时，需要额外安装webpack-cli
npm i -D webpack-cli
```
# 检查安装
```bash
# command not found 默认在全局环境中查找
webpack -v 
# npx帮助我们在项目中的node_modules里查找webpack
npx webpack -v
# 到当前的node_modules模块里指定webpack
./node_modules/.bin/webpack -v
```
# 启动webpack执行构建
## webpack默认配置
1. webpack默认支持JS模块和JSON模块
2. 支持CommonJS，AMD和ES module等模块类型
3. webpack4支持零配置使用，但是很弱，稍微复杂些的场景都需要额外的扩展。
## 准备执行构建
1. 新建src文件夹
2. 新建src/index.js, src/index.json, src/other.js

```js
// src/index.js
/**
 * webpack 打包入口文件
 */
// 依赖文件
const json =require("./index.json") // Common JS
import { add } from "./other.js"    // ES Module

console.log(json, add(2,3))

// src/index.json
{
    "name": "JSON"
}

// src/other.js
export function add(n1, n2) {
    return n1+ n2
}
```

## 执行构建
原理:就是通过shell脚本在node_modules/.bin目录下创建一个软链接。
```bash
# npx 方式: 会执行项目node_modules/.bin/xxx目录下的包
npx webpack

# npm script方式
npm run test
```

修改package.json文件：
```json
{
    "scripts": {
        "test": "webpack"
    }
}
```
## 构建成功
在项目根目录下会生成一个dist目录，里面会有一个main.js，这个文件是一个可执行的JavaScript文件，里面包含webpack BooStrap启动函数。
## 默认配置
webpack 默认配置
```js
const path = require("path")
module.exports = {
    entry: "./src/index.js",  // webpack执行构建的入口，必填
    output: {
        filename: "main.js",  // 将所有依赖的模块合并输出到main.js
        path: path.resolve(__dirname, "./dist")  // 输出文件的存放路径，必须是绝对路径
    }
}
```
# webpack配置核心概念
零配置是很弱，特定的需求，总是需要shiy自己进行配置。webpack有默认的配置文件，叫webpack.config.js，我们可以对这个文件进行修改，进行个性化配置。也可以使用自定义配置文件，通过--config webpack.config.dev.js 来指定webpack使用哪个配置文件来执行构建。
## webpack.config.js配置基础结构
```js
module.exports = {
    entry: "./src/index.js", // 打包入口文件
    output: "./dist", // 输出路径
    mode: "production", // 打包环境
    module: {
        rules: [  // loader模块处理
            {
                test: /\.css$/,
                use: "style-loader"
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()] // 插件配置
}
```

## entry
指定webpack打包入口文件：Webpack执行构建的第一步将从entry开始。
```js
// 单入口SPA，本质是个字符串
entry: {
    main: './src/index.js'
}
// 等效如下
entry: "./src/index.js"

// 多入口entry是个对象
entry: {
    index: "./src/index.js",
    login: "./src/login.js"
}
```

## output
打包转换后的文件输出到磁盘位置，在webpack经过一系列处理并得出最终想要的代码后输出结果。
```js
output: {
    filename: "build.js", // 输出文件的名称
    path: path.resolve(__dirname, "dist") // 输出文件到磁盘的目录，必须是绝对路径
}

// 多入口的处理
output: {
    filename: "[name][chunkhash:8].js", // 利用占位符，文件名称不要重复
    path: path.resolve(__dirname, "dist") // 输出文件到磁盘的目录，必须是绝对路径
}
```
## mode
mode用来指定当前的构建环境，production，development，none。
设置mode可以自动触发webpack内置的函数，达到优化的效果。如果没有设置，webpack会将mode 的默认值设置为production。


development: 会将DefinePlugin中process.env.NODE_ENV的值设置为development。启用NamedChunksPlugin和NamedModulesPlugin。development的开启有利于热更新的处理，识别哪个模块变化了。

production: 会将DefinePlugin中process.env.NODE_ENV的值设置为production。启用FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，SideEffectsPlugin 和 TerserPlugin。production开启会有帮助模块压缩，处理副作用等一些功能。

none: 不使用任何默认优化选项。
## loader
模块解析，模块转换器，用于把模块原内容按照需求转换成新内容。

webpack是模块打包工具，而模块不仅仅是js，还可以是CSS，图片或者其他格式。

但是webpack默认只知道如何处理js和JSON模块，那么其他格式的模块处理就需要loader了。

```js
// 常见的loader
style-loader
css-loader
less-loader
sass-loader
ts-loader // 将TS转换成JS
babel-loader // 转换ES6，7等js新特性语法
file-loader // 处理图片子图
eslint-loader
```

## module
模块，在Webpack里一切皆模块，一个模块对应着一个文件。Webpack会从配置里的entry开始递归找出所有依赖的模块。

当webpack处理到不认识的模块时，需要在webpack中的module处进行配置，当检测到是什么格式的模块，应使用什么loader来处理。
```js
module: {
    rules: [
        {
            test: /\.xxx$/, // 指定匹配规则
            use: {
                loader: 'xxx-loader' // 指定使用的loader
            }
        }
    ]
}
```

1. file-loader : 处理静态资源模块
原理是把打包入口中识别出的资源模块，移动到输出目录，并且返回一个地址名称。

使用场景：当需要模块，仅仅是从项目源代码位置挪动到打包目录，就可以使用file-loader来处理，txt，svg，csv，excel，图片资源等。

```js
// 安装loader
npm install file-loader -D

// 使用
module: {
    rules: [
        {
            test: /\.(png|jpe?g|gif)$/,
            use: {                               // use使用一个loader可以用对象，字符串，两个loader需要用数组
                loader: "file-loader",
                options: {                       // 额外的配置，输出资源名称。
                    name: "[name]_[hash].[ext]", // []括号里面是占位符，name表示老资源模块的名称，ext表示老资源模块的后缀名
                    outputPath: "images/"        // 打包后的存放位置
                }
            }
        }
    ]
}
```

2. css处理
css-loader 分析css模块之间的关系，并合并成一个css。
loader执行顺序: 从后往前。
style-loader会把css-loader生成的内容，以style挂载到页面的header部分。
```js
// 安装
npm install style-loader css-loader -D

// 配置
{
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
}

{
    test: /\.css$/,
    use: [{
        loader: "style-loader",
        options: {
            injectType: "singletonStyleTag" // 将所有的style标签合并成一个style标签
        }
    }， "css-loader"]
}
```
## Plugins
plugin可以在webpack运行到某个阶段的时候，帮你做一些事情，类似于生命周期的概念。

扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
### HtmlWebpackPlugin
htmlwebpackplugin会在打包结束后，自动生成一个html文件，并把打包生成的js模块引入到该html中。
```bash
#  安装
npm install -D html-webpack-plugin
```

配置
```js
title: 用来生成页面的title元素
filename: 输出的HTML文件名，默认是index.html, 也可以直接配置带有子目录。
template: 模板文件路径，支持加载器。
inject: true|'head'| 'body'|false, 注入所有的资源到特定的template或templateContent中，如果设置为true或者body，所有的javascript资源将被放到body元素的底部，'head'将放到head元素中。
favicon: 添加特定的favicon路径到输出的HTML文件中。
minify: {} | false, 传递html-minifier选项给minify输出
hash: true| false, 如果为true，将添加一个唯一的webpack编译hash到所有包含的脚本和css文件，对于解除cache很有用。
cache: true | false, 如果为true，这是默认值，仅仅在文件修改之后才会发布文件。
showErrors: true|false,如果为true，这是默认值，错误信息会写入到html页面中。
chunks: 允许只添加某些模块（比如，仅仅unit test）。
chunksSortMode: 允许控制块添加到页面之前的排序方式，支持的值: 'none'| 'default' | {function}-default: 'auto'
excludeChunks: 允许跳过某些块（比如，跳过单元测试的块）
```
案例
```js
const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    ...
    plugins: [
        new htmlWebpackPlugin({
            title: "my app",
            filename: "app.html",
            template: "./src/index.html"
        })
    ]
}
```

生成新的index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>my app</title>
  </head>
  <body>
    <div id="app"></div>
  <script src="main.js"></script></body>
</html>
```

### clean-webpack-plugin
clean-webpack-plugin 插件就是每次生成代码之前 先将 dist 目录 清空
一般这个插件是配合 webpack -p 这条命令来使用，就是说在为生产环境编译文件的时候，先把 build或dist (就是放生产环境用的文件) 目录里的文件先清除干净，再生成新的。

安装
```bash
npm install -D clean-webpack-plugin
```
配置
```js
const { CleanWebpackPlugin } = reuqire("clean-webpack-plugin")
...
plugins: [
    new CleanWebpackPlugin()
]

```
### sourceMap
源代码与打包后的代码的映射关系，通过sourceMap定位到源代码。
在dev模式下，默认开启，可以在配置文件里设置关闭。
```js
devtool: "none"

// 选项：
"eval" 速度最快，使用eval包裹模块代码
"source-map" 产生.map文件
"cheap" 较快，不包含列信息
"Module" 第三方模块，包含loader的sourcemap
"inline" 将.map作为DataURI嵌入，不单独生成.map文件
```
配置推荐
```js
devtool: "cheap-module-eval-source-map", // 开发环境配置
// 线上不推荐开启
devtool: "cheap-module-source-map", // 线上生成配置。
```



---
title: webpack3
date: 2020-08-10 15:55:54
tags:
---

# webpack 性能优化
webpack性能优化主要在两个方面：优化开发体验和优化输出质量

## 优化开发体验
1. 提高开发效率
2. 提高构建速度

## 优化输出质量
1. 优化要发布到线上的代码，减少用户能感知到的加载时间。
2. 提升代码性能，性能好，执行就快。

## 缩小文件范围
### 优化loader配置
test，include，exclude三个配置项来缩小loader的处理范围。推荐include。
```js
include： path.resolve(__dirname, "./src")
```
### 优化resolve.modules配置
resolve.modules用于配置webpack去哪些目录下寻找第三方模块，默认是node_modules.

默认是在当前项目目录下的node_modules里面去找，如果没有找到，就会去上一级目录../node_modules去找，再没有会去../../node_modules中去找，以此类推。和NodeJs的模块查找机制很类似。

如果我们的第三方模块都安装在了项目的根目录下，就可以直接指明这个路径,节省了查找的时间。
```js
module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, "./node_modules")]
    }
}
```
### 优化resolve.alias配置
resolve.alias配置通过别名来将原导入路径映射成一个新的导入路径。
以react为例，引入react库，一般存在两套代码cjs，umd。默认情况下，webpack会从入口文件./node_modules/bin/react/index开始递归解析和处理依赖的文件。我们可以直接指定文件，避免查找耗时。

```js
alias: {
    "@": path.join(__dirname, "./pages"),
    react: path.resolve(__dirname, "./node_modules/react/umd/react.production.min.js"),
    "react-dom": path.resolve(__dirname, "./node_modules/react-dom/umd/react-dom.production.min.js")
}
```
### 优化resolve.extensions配置
resolve.extensions在导入语句没带文件后缀时，webpack会自动带上后缀后，去尝试查找文件是否存在。
默认值：
```js
extensions: ['js', 'json', 'jsx', 'ts']
```
优化策略： 后缀名尝试列表尽量的小，导入语句尽量带上后缀名。

## 使用静态资源路径publicPath(CDN)
CDN通过将资源部署到世界各地,使得用户可以就近访问资源,加快访问速度。要接入CDN,需要把网⻚的静态资源上传到CDN服务上,在访问这些
资源时,使用CDN服务提供的URL。
两个必备条件： 公司得有cdn服务器地址，确保静态资源文件的上传。
```js
output: {
    publicPatch: "//cdnURL.com", // 指定存放JS文件的CDN地址。
}
```

## CSS文件的处理
使用less 或 sass当作css技术栈
```js
npm install less less-loader -D
{
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "less-loader"]
}
```
使用postcss为样式自动补齐浏览器前缀
```js
npm i postcss-loader autoprefixer -D
```
新建postcss.config.js
```js
module.exports = {
    plugins: [
        require("autoprefixer")({overrideBrowserslist: ["last 2 versions", ">1%"]})
    ]
}
```
新建index.less
```less
body {
    div {
        display: flex;
        border: 1px red solid;
    }
}
```
修改webpack.config.js
```js
{
    test: /\.less$/,
    include: path.resolve(__dirname, "./src"),
    use: [
        "style-loader",
        {
            loader: "css-loader",
            options: {}
        },
        "less-loader",
        "postcss-loader"
    ]
}
```

## 借助MiniCssExtractPlugin完成抽离css
如果不做抽取配置，我们的css是直接打包进js里面的，我们希望能单独生成css文件。因为单独生成css，css可以和js并行下载，提高页面加载效率。

```js
// 安装
npm i mini-css-extract-plugin -D
// 配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

{
    test: /\.scss$/,
    use: [
        MiniCssExtractPlugin.loader, // 代替style-loader
        "css-loader",     // 编译css
        "postcss-loader", //自动补齐浏览器前缀
        "sass-loader"     // 编译scss
    ]
}

plugins: [
    new MiniCssExtractPlugin({
        filename: "css/[name]_[contenthash:6].css",
        chunkFilename: "[id].css"
    })
]
```
## 压缩CSS
借助optimize-css-assets-webpack-plugin
借助cssnano

安装
```js
npm i cssnano -D
npm i optimize-css-assets-webpack-plugin -D

const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")

plugins: [
    new OptimizeCssAssetsPlugin({
        cssProcessor: require("cssnano"), // 引入cssnano配置压缩选项
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        }
    })
]
```

## 压缩HTML
借助html-webpack-plugin
```js
new htmlWebpackPlugin({
    title: "my app",
    template: "./index.html",
    filename: "index.html",
    minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true           // 压缩内敛css
    }
})
```
## development VS production模式区分打包
```js
// 安装webpack-merge
npm i webpack-merge -D
// 合并通用配置到特定模式 webpack.dev.js
const merge = require("webpack-merge")
const commonConfig = require("./webpack.common.js")
const devConfig = {...}

module.exports = merge(commonConfig, devConfig)

// package.json
"scripts":{
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
}
```
### 基于环境变量区分
借助cross-env
```js
npm i cross-env -D
```
package里面配置命令脚本，传入参数
```js
"test": "cross-env NODE_ENV=test webpack --config ./webpack.config.test.js"
```
在webpack.config.js里面拿到参数
process.env.NODE_ENV
```js
//外部传入变量
scripts:" --env.production xxx"
// 外部传入的全局变量
module.exports = () => {
    if (env && env.production) {
        return merge(commonConfig, prodConfig)
    } else {
        return merge(commonConfig, devConfig)
    }
}
```
## Tree Shaking
webpack 2.x开始支持tree shaking概念，也就是"摇树"，清除无用的css,js(dead code)。
Dead Code 一般具有以下几个特征
1. 代码不会被执行，不可到达。
2. 代码执行的结果不会被用到
3. 代码只会影响死变量(只写不读)

### CSS Tree Shaking
```js
// 安装
npm i glob-all purify-css purifycss-webpack -D
// 配置
const PurifyCSS = require('purifycss-webpack') // 进行css tree shaking
const glob = require('glob-all')                // 路径处理，定位要做tree shaking的文件

plugins: [
    // 清除无用css
    new PurifyCSS({
        paths: glob.sync([ // 要做CSS Tree Shaking的路径文件
            path.resolve(__dirname, './src/*.html'), // 对html文件进行tree shaking
            path.resolve(__dirname, './src/*.js')
        ])
    })
]
```

### JS tree shaking
只有mode是production才会生效，development的tree shaking是不生效的，因为webpack为了方便调试。生产模式不需要配置，默认开启。
只支持import方式引入，不支持commonjs的方式引入。因为JS tree shaking 依赖于ES6的静态分析，在编译时确定模块。如果是require，在运行时确定模块，那么将无法去分析模块是否可用，只有在编译时分析，才不会影响运行时的状态。
例子：
```js
// expo.js
export const add = (a, b) => {
    return a + b
}
export const minus = () => {
    return a - b
}
// index.js
import { add } from "./expo"
add(1, 2)

// webpack.config.js
optimization: {
    usedExports: true // 被使用了的导出模块。
}
```
## 副作用
## 代码分割Code Splitting
## DllPlugin插件打包第三方类库 优化构建性能
## 使⽤happypack并发执⾏任务
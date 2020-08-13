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
        minifyCSS: true           // 压缩内联css
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
如果引入的包/模块被标记为sideEffects：false，那么不管它是否真的有副作用，只要它没有被引用到，整个模块/包都会被完整的移除。
```js
// package.json
"sideEffects": false, // 正常对所有模块进行tree shaking
"sideEffects": ['*.css', '@babel/polyfill'] // 在数组中排除不需要tree shaking的模块
```
## 代码分割Code Splitting
打包完成之后，所有页面只生成了一个bundle.js
我们引入一个第三方工具库，却只使用了其中一小部分功能，体积增大。

```js
import _ from 'lodash'

console.log(_.join(['a', 'b', 'c']))
```
在webpack中实现代码分割
```js
optimization: {
        splitChunks: {
            chunks: 'async',    // 对同步 initial，异步 async，所有的模块有效 all    
            minSize: 30000,     // ⼩尺寸，当模块⼤于30kb   
            maxSize: 0,         // 对模块进行二次分割时使用，不推荐使用    
            minChunks: 1,       // 打包生成的chunk文件少有⼏个chunk引用了这个模块     
            maxAsyncRequests: 5,// 大异步请求数，默认5  
            maxInitialRequests: 3, // ⼤初始化请求书，⼊口文件同步请求，默认 3     
            automaticNameDelimiter: '~', // 打包分割符号 
            name: true,                  // 打包后的名称，除了布尔值，还可以接收⼀个函数 function      
            cacheGroups: {               // 缓存组     
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",      // 要缓存的 分隔出来的 chunk 名称          
                    priority: -10        // 缓存组优先级 数字越⼤，优先级越高  
                },
                other: {
                    chunks: "initial",   // 必须三选一："initial" | "all" | "async"(默认就是async)
                    test: /react|lodash/, // 正则规验证，如果符合就提取 chunk,   
                    name: "other",
                    minSize: 30000,
                    minChunks: 1,
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true // 可设置是否重用该chunk        
                    }
                }
            }
        }
    }
```
使用下面配置即可：
```js
optimization:{  
    //帮我们⾃自动做代码分割  
    splitChunks:{    chunks:"all", //默认是支持异步，我们使用all 
    }
}
```
## DllPlugin插件打包第三方类库 优化构建性能
Dll动态链接库
项目中引入了很多第三方库，这些库在很长的一段时间内，基本不会更新，打包的时候分开打包来提升打包速度。而DllPlugin动态链接库插件，其原理就是把网页依赖的基础模块抽离出来打包到dll文件中，当需要导入的模块存在于某个dll中时，这个模块不再被打包，而是去dll中获取。

新建webpack.dll.config.js
```js
// 静态公共资源打包配置
const path = require('path')
const { DllPlugin } = require('webpack')

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    mode: NODE_ENV,
    entry: ["react", "react-dom"],
    output: {
        path: path.resolve(__dirname, '..', 'dll'),
        filename: 'react.dll.js',
        library: 'react',
    },
    plugins: [
        new DllPlugin({           
            path: path.resolve(__dirname, 'dll/reactmanifest.json'),  // manifest.json文件的输出位置       
            name: 'react'                                             // 定义打包的公共vendor文件对外暴露的函数名   
        })
    ]
}
```
在package.json中添加
```js
"build:dll": "cross-env NODE_ENV=development webpack --config ./build/webpack.dll.config.js",
```
运行
```bash
npm run build:dll
```
运行之后会发现多了一个dll文件夹，里面有dll.js文件，这样就把第三方库单独打包了。

安装依赖以下依赖，它将我们打包后的dll.js文件注入到我们生成的index.html中。
```bash
npm i add-asset-html-webpack-plugin
```

在webpack.base.config.js文件中进行更改。
```js
new AddAssetHtmlWebpackPlugin({
    filepath: path.resolve(__dirname, '../dll/react.dll.js') // 对应的dll文件路径
}),
new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, 'dll/react-manifest.json')
})
```
## 使⽤happypack并发执⾏任务
运行在NodeJS上的webpack是单线程模型的，也就是说webpack需要一个一个地处理任务，不能同时处理多个任务。Happy Pack 就能让webpack做到这一点，它将任务分解给多个子进程去并发执行，子进程处理完之后再将结果发送给主进程。

安装
```bash
npm i -D happypack
```
配置webpack.config.js
```js
const happyThreadPool = HappyPack.ThreadPool({size:5})
rules: [ 
     {
         test: /\.jsx?$/,
         exclude: /node_modules/,
         use: [
            {   // 一个loader对应一个id
                loader: "happypack/loader?id=babel"
            },
            {
                test: /\.css$/,
                include: path.reslove(__dirname, "./src"),
                use: ["happypack/loader?id=css"]
            }
         ]
     }
]

plugins: {
    new HappyPack({
        // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
        id: 'babel',
        // 如何处理.js文件，用法和loader配置中一样
        loaders: ['babel-loader?cacheDirectory'],
        threadPool: HappyPackThreadPool
    }),
    new HappyPack({
        id: "css",
        loaders: ["style-loader", "css-loader"]
    })
}
```
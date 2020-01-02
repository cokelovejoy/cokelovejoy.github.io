---
title: Koa原理
date: 2019-12-31 10:53:50
tags:
---
# Koa 原理:
* 一个基于nodejs的入门级的http服务,代码如下:
```js
const http = require('http')
const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end('<h1>hello world</h1>')
})
server.listen(3000, () => {
    console.log('listen on port 3000')
})

```

* koa的目标是用更简单化,流程化,模块化的方式实现回调部分.
实现自己的Koa类
```js
// 实现自己的Koa类来创建server
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class MyKoa {
    // 初始化中间件数组
    constructor() {
        this.middlewares = []
    }
    // 构建上下文,把res和req都挂载在ctx上,并且在 ctx.req和ctx.request.req同时保存
    createContext(req, res) {
        // 创建一个新的对象实例 并且以context对象的原型为原型
        const ctx = Object.create(context)
        ctx.request = Object.create(request)
        ctx.response = Object.create(response)

        // 挂载原生node的req和res
        ctx.req = ctx.request.req = req
        ctx.res = ctx.response.res = res
        return ctx
    }
    listen(...args) {
        const server = http.createServer(async (req, res) => {
            // 创建上下文,挂载req, res
            let ctx = this.createContext(req, res)
            // 中间件合成
            const fn = this.compose(this.middlewares)
            // 执行合并函数并传入上下文
            await fn(ctx)
            //响应
            res.end(ctx.body)

        })
        server.listen(...args)
    }
    use(middleware) {
        // use的时候将中间件加到数组里
        this.middlewares.push(middleware)
    }
    // 合成函数
    compose(middlewares) {
        return function(ctx) { // 传入上下文
            function dispatch(i) {
                let fn = middlewares[i]
                if (!fn) {
                    return Promise.resolve()
                }
                // 将上下文传入中间件和next回调函数 middleware(ctx, next)
                return Promise.resolve(fn(ctx, function () {
                    return dispatch(i + 1)
                }))
            }
            return dispatch(0)
        }
    }
}

module.exports = MyKoa
```
使用MyKoa
```js
// 创建app.js

const MyKoa = require('./MyKoa')
const app = new MyKoa()

const delay = function () {
    return Promise.resolve(resolve => setTimeout(() => resolve()), 2000)
}
app.use(async (ctx, next) => {
    ctx.body = '1'
    await next()
    ctx.body += '5'
})
app.use(async (ctx, next) => {
    ctx.body += '2'
    await delay()
    await next()
    ctx.body += '4'
})
app.use(async (ctx, next) => {
    ctx.body += "3";
});
app.listen(3000, () => {
    console.log('listen on port 3000')
})
```
* Koa 为了简化API,引入上下文(context)概念,将原始请求对象req和响应对象res封装并挂载到context上,并且在context上设置getter和setteer,从而简化操作.

```js
app.use(ctx => {
    ctx.body = 'hello'
})
```

* 封装request和response和context
request.js
```js
// request.js
// 封装request
module.exports = {
    get url() {
        return this.req.url
    },
    get method() {
        return this.req.method.toLowerCase()
    }
}
```
response.js
```js
module.exports = {
    get body() {
        return this._body
    },
    set body(val) {
        this._body = val
    }
}
```
context.js
```js
module.exports = {
    get url() {
        return this.request.url
    },
    get body() {
        return this.response.body
    },
    set body(val) {
        this.response.body = val
    },
    get method() {
        return this.request.method
    }
}
```

* 中间件
Koa中间件机制: 就是函数组合的概念, 将一组需要顺序执行的函数复合为一个函数,外层函数的参数实际是内层函数的返回值.

异步中间件执行顺序
```js
function compose(middlewares) {
    return function() {
        function dispatch(i) {
            let fn = middlewares[i]
            if (!fn) {
                return Promise.resolve()
            }
            return Promise.resolve(
                fn(function next() {
                    // promise 完成后,再执行下一个
                    return dispatch(i + 1)
                })
            )
        }
        return dispatch(0)
    }
}
async function fn1(next) {
    console.log("fn1")
    await next();
    console.log(" end fn1")
}

async function fn2(next) {
    console.log("fn2")
    await delay()
    await next()
    console.log("end fn2")
}
function fn3() {
    console.log("fn3")
}
function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000)
    })
}
const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()
/*
fn1
fn2
fn3
end fn2
 end fn1
*/
```

* 常见的Koa中间件的实现
1. koa中间件的规范:
    * 一个async函数
    * 接受ctx和next两个参数
    * 人物结束需要执行next
```js
const mid = async (ctx, next) => {
    // 来到中间件,洋葱圈左边
    next() // 进入入其他中间件
    // 再次来到中间件,洋葱圈右边
};
```

2. 中间件常见任务:
    * 请求拦截
    * 路由
    * 日志
    * 静态文件服务

3. 实现koa-router
router.js

```js
class Router {
    constructor() {
        this.stack = []
    }
    register(path, methods, middleware) {
        let route = { path, methods, middleware}
        this.stack.push(route)
    }
    // get method
    get(path, middleware) {
        this.register(path, 'get', middleware)
    }
    // post method
    post(path, middleware) {
        this.register(path, 'post', middleware)
    }
    // routes
    routes() {
        let stock = this.stack
        return async function(ctx, next) {
            let currentPath = ctx.url
            let route
            for (let i=0; i < stock.length; i++) {
                let item = stock[i]
                if (currentPath === item.path && item.methods.indexOf(ctx.method) >=0) {
                    // 判断path和method
                    route = item.middleware
                    break
                }
            }
            if (typeof route === 'function') {
                route(ctx, next)
                return
            }
            await next()
        }
    }
}
module.exports = Router
```
使用router
app.js

```js
const MyKoa = require('./MyKoa')
const Router = require('./router')
const app = new MyKoa()
const router = new Router()

router.get('/index', async ctx => {
    console.log('index')
    ctx.body = 'index page'
})

router.get('/list', async ctx => {
    console.log('list')
    ctx.body = 'list page'
})

router.post('/index', async ctx => {
    ctx.body = 'post page'
})

// 路由实例输出 父中间件 router.routes()

app.use(router.routes())
app.listen(3000, () => {
    console.log('server running on port 3000')
})
```

* 静态文件服务koa-static
    * 配置绝对资源目录地址, 默认为static
    * 获取文件或者目录信息
    * 静态文件读取
    * 返回

```js
// 静态文件服务
const fs = require("fs")
const path = require("path")

module.exports = (dirPath = "./public") => {
    return async (ctx, next) => {
        if (ctx.url.indexOf('/public') == 0) {
            // public开头 读取文件
            // 获取 /public 所在本地中的绝对路径
            const url = path.resolve(__dirname, dirPath)
            // 获取path的最后一部分
            // const fileBaseName = path.basename(url)
            // 要访问的目录路径
            const filepath = url + ctx.url.replace("/public", "")
            console.log(filepath)
            try {
                // 返回一个stat数组对象
                stats = fs.statSync(filepath)
                // 判断是否为目录
                if (stats.isDirectory()) {
                    // 返回一个包含“指定目录下所有文件名称”的数组对象
                    const dir = fs.readdirSync(filepath)
                    const ret = ['<div style="padding-left:20px">']
                    dir.forEach(filename => {
                        console.log(filename)
                        // 简单认为不带小数点的格式,就是文件夹,实际应该用statSync
                        if (filename.indexOf('.') > -1) {
                            ret.push(
                                `<p><a style="color:black" href="${ctx.url}/${filename}">${filename}</a></p>`
                            )
                        } else {
                            ret.push(`<p><a href="${ctx.url}/${filename}">${filename}</a></p>`)
                        }
                    })
                    ret.push("</div>")
                    ctx.body = ret.join("")
                } else {
                    console.log('文件')
                    // 同步读取文件
                    const content = fs.readFileSync(filepath)
                    ctx.body = content
                }
            } catch (err) {
                // 报错
                ctx.body = "404, not found"
            }
        } else {
           // 不是静态资源,直接去下一个中间件
           await next() 
        }
    }
}
```
使用
```js
const static = require('./static')
app.use(static(__dirname + '/public'))
```

* 请求拦截: 黑名单中存在的ip访问将被拒绝
```js
// 请求拦截: 黑名单中存在的ip访问将被拒绝
module.exports = async function (ctx, next) {
    const { req, res } = ctx
    const blackList = ['127.0.0.1'] // 将禁止访问的ip写入数组内
    const ip = getClientIp(req)
    if (blackList.includes(ip)) {
        // 出现在黑名单中将被拒绝
        ctx.body = "not allowed"
    } else {
        await next()
    }
    
}
function getClientIp(req) {
    return (
        req.headers['x-forwarded-for'] ||   // 判断是否有反向代理理 IP
        req.connection.remoteAddress ||     // 判断 connection 的远程 IP
        req.socket.remoteAddress ||         //判断后端的 socket 的 IP
        req.connection.socket.remoteAddress
    )
}
```
使用
```js
const interrupt = require('./request-interrupt')
app.use(interrupt)
```
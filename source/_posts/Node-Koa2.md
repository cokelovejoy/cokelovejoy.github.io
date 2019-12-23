---
title: Node Koa2
date: 2019-12-23 14:09:02
tags:
---
## koa 简介
* 概述: Koa 基于Nodejs平台的web框架,koa 不在内核方法中绑定任何中间件，它仅提供一个轻量的函数库,更有效率的编写服务端应用程序.
* 特点:
    * 轻量,无捆绑
    * 中间件架构
    * 优雅的API设计
    * 增强的错误处理
* 安装
Koa 依赖 node v7.6.0
```bash
npm i koa
```
* 应用
中间件机制、请求、响应处理
```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
    ctx.body = [{name: 'Tom'}]
    next()
})
app.use(async (ctx, next) => {
    console.log('url ', ctx.url)
    if (ctx.url === '/html') {
        ctx.type = 'text/html;charset=utf-8'
        ctx.body = `my name is ${ctx.body[0].name}`
    }
})

app.listen(3000)
```

## Context(上下文)
Koa Context 将 node 的 request 和 response 对象封装在一个单独的对象里面，其为编写 web 应用和 API 提供了很多有用的方法.

context 在每个 request 请求时被创建，在中间件中作为接收器(receiver)来引用.
```js
app.use(async ctx => {
  ctx; // is the Context
  ctx.request; // is a koa Request
  ctx.response; // is a koa Response
});
```
许多 context 的访问器和方法为了便于访问和调用，简单的委托给他们的 ctx.request 和 ctx.response 所对应的等价方法， 比如说 ctx.type 和 ctx.length 代理了 response 对象中对应的方法，ctx.path 和 ctx.method 代理了 request 对象中对应的方法。

### ctx对象常用
ctx对象 可以用来获取header和设置响应body等等.
```js
const ctx = {
    // 请求 koa request
    request: {
        method: 'GET',
        url: '/',
        header: {
            host: 'localhost:3000',
            connection: 'keep-alive',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
            'sec-fetch-user': '?1',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7',
            cookie: '_hjid=5c5ad555-0426-41d4-8249-f4d47d617f24; ABTasty=uid=19090212351428483&fst=1567398914410&pst=1576572507769&cst=1576743674400&ns=916&pvt=1188&pvis=301&th=493794.619463.308.27.151.1.1573042428637.1576743943914.1_505478.0.261.7.122.1.1573463931498.1576488639383.1_509169.0.281.1.40.1.1574068957131.1576572507782.1_515682.644756.118.6.17.1.1575885466806.1576744825251.1'
        }
    },
    // 响应 koa response
    response: {
        status: 200,
        message: 'OK',
        header: {
            'content-type': 'application/json; charset=utf-8'
		}
	},
    app: {
        subdomainOffset: 2,
        proxy: false,
        env: 'development'
    },
    originalUrl: '/',
    // 原生Node的request对象
    req: '<original node req>',
    // 原生Node的response对象
    res: '<original node res>',
    socket: '<original node socket>'
}
```

1. 区分request,response,req, res
* request   koa的请求对象
* response  koa的响应对象
* req       Node的请求对象
* res       Node的响应对象
避免使用Node属性和方法.

2. ctx.app
应用实例引用

3. ctx.state
命名空间,用于通过中间件传递信息到前端视图.(保存某些data,然后全局可用)

```js
ctx.state.user = {
    name: 'Tom',
    age: 18
}
```
## 路由
Koa中的路由和Express不同,Express内部集成了路由,而Koa则需要通过koa-router模块使用路由.
1. 安装
```bash
npm install koa-router -S
```
2. 使用
```js
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
app.use(async (ctx, next) => {
    ctx.body = 'hello world'
    next()
})
router.get('/string', async (ctx,next) => {
    ctx.body = 'koa2 string'
    next()
})

router.get('/json', async (ctx,next) => {
    ctx.body = {title: 'koa2 json'}
})

app.use(router.routes())
app.listen(3002)
```
## 中间件
Koa中间件机制就是函数组合的概念,将一组需要顺序执行的函数复合为一个函数,外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机制.
使用app.use()加载中间件。每个中间件接收两个参数，ctx对象和next函数，通过调用next将执行权交给下一个中间件。
<img src="/static/img/middleware.png">

中间件分为:
* 应用级中间件
任何路由都会先经过应用级中间件，当执行完成next后再去匹配相应的路由。
```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 应用级中间件
app.use(async (ctx, next) => {
    await next();
})

router.get('/', async ctx => {
    ctx.body = 'hello koa';
})

// 启动路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, err => {
    if (err) throw err;
    console.log('runing...')
})
```
* 路由级中间件
路由匹配过程中，对于相同路由会从上往下依次执行中间件，直到最后一个没有next参数的中间件为止。
```js
router.get('/user', async (ctx, next) => {
    console.log(111)
    await next();
})

router.get('/user', async (ctx, next) => {
    console.log(222)
    await next();
})

router.get('/user', async ctx => {
    console.log(333)
    ctx.body = 'Hello'
})  

// 依次打印
// 111
// 222
// 333
```
* 错误处理中间件

路由在匹配成功并执行完相应的操作后还会再次进入应用级中间件执行 next 之后的逻辑。所以对于404、500等错误可以在最外层的（第一个）应用级中间件的next之后做相应的处理。
如果只有一个应用级中间件的话，顺序就无所谓所有路由中间的之前之后了.

```js
app.use(async (ctx, next)=> {
    await next();
    if(ctx.status === 404){
        ctx.body="404页面"
    }
});
```

* 第三方中间件
类似于koa-router、koa-bodyparser等就是第三方中间件。

* 合成中间件
 koa-compose 模块可以将多个中间件合成为一个。
 ```js
const compose = require('koa-compose')
const first = asycn (ctx, next) => {
    await next();
}
const second = async ctx => {
    ctx.body = 'Hello';
}

const middle = compose([first, second]);
app.use(middle);
```
* koa执行顺序
每一个app.use(),传入use内的是一个中间件函数(异步函数,使用async),代码从上往下依次执行每个app.use()内部的中间件函数.当中间件内部遇到next()函数时,该函数后续代码的执行会被暂停,先去执行下一个app.use()内的中间件函数,如此继续进行,直到所有的中间件执行完后,再返回从下往上依次执行每个中间件中被暂停挂起的后续代码(从最底层向最顶层执行).

多个中间件会形成堆栈结构，按先进后出顺序执行.

## 获取数据
1. GET传值
Koa中GET传值通过request接受,两种方式: query 和querystring.
query:返回的是参数对象.{name: 'tom', age: 18},
querystring: 返回的是请求字符串. 'name=tom&age=12'

```js
 // 从ctx.request下获取
let query = ctx.request.query;
let querystring = ctx.request.querystring;

// 直接ctx获取
ctx.query
ctx.querystring
```
2. POST传值
通过原生Node处理
```js
const querystring = require('querystring');

module.exports = ctx => {
    return new Promise((resolve, reject) => {
        try {
            let data = '';

            // ctx.req实际上就是原生node中的req
            ctx.req.on('data', (chunk) => {
                data += chunk;
            })

            ctx.req.on('end', () => {
                data = querystring.parse(data);
                resolve(data);
            })
        } 
        catch(err) {
            reject(err);
        }
    })
}
```

使用 koa-bodyparser模块
```js
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// 获取
ctx.request.body
```
## 处理静态资源
对于js,css,img等静态资源采用koa-static中间件处理
```bash
npm install koa-static
```
配置:
静态目录为static
```js
 app.use(require('koa-static')(__dirname + '/static'))
```
在模板中即可访问:
```html
<link rel="stylesheet" href="/css/header.css">
<img src="/image/account.eb695dc.png"/>
```
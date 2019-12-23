---
title: NodeJS
date: 2019-12-18 17:48:24
tags:
---
# NodeJs
## 理解NodeJS是什么
官方的话:Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。
自己的话: Node.js 就是javaScript的运行环境,不同于ECMAScript,node.js里面提供了许多能进行系统编程,网络编程的库(如:fs, os, net, http,等等)这样子就能操作我们的主机了. 可以类比C语言,JAVA语言,他们都能对系统进行操作,而NodeJs出现就是为了让javaScript有能力操作我们的系统.

类比理解运行时的概念: 
* JRE java运行时环境
* C Runtime
* .Net Common Language Runtime

运行时 runtime 就是 程序运行的时候.
运行时库 就是程序运行的时候所需要依赖的库.

运行的时候指的是指令加载到内存并由CPU执行的时候.
C代码编译成可执行文件的时候, 指令没有被CPU执行, 这个时候是编译时,就是编译的时候.
## NodeJS特性 (本质就是JavaScript的特性)
* 非阻塞I/O
* 事件驱动

## NodeJS程序
运行js代码命令:
```bash
node xxxx.js
```
每次修改js文件需要重新执行才能生效,安装nodemon可以监视文件改动,自动重启:
```bash
npm i -g nodemon
```
然后用nodemon 运行js代码:
```bash
nodemon xxx.js
```
### module(模块)
模块分为核心模块,内置模块,第三方模块
模块操作: require(), module.exports = {}, exports.xxxFunc = () => {}
#### 核心模块
核心模块不需要引用,可以通过关键字直接使用
* Buffer
Buffer - 用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。 八位字
节组成的数组,可以有效的在JS中存储二进制数据
方法: alloc(), from(), write(), concat(), toString()
```js
// 创建一个长度为10 字节 以0填充的内存空间, Buffer 的大小在创建时确定，且无法更改.
const buf1 = Buffer.alloc(10) 
console.log(buf1)

// 创建一个Buffer包含ascii字符
const buf2 = Buffer.from('a')
console.log(buf2, buf2.toString())

// 创建Buffer包含UTF-8字节
// UFT-8:一种变长的编码方案,使用 1~6 个字节来存储;
// UFT-32:一种固定长度的编码方案,不管字符编号大小,始终使用 4 个字节来存储;
// UTF-16:介于 UTF-8 和 UTF-32 之间,使用 2 个或者 4 个字节来存储,长度既固定又可变
const buf3 = Buffer.from('中文')
console.log(buf3, buf3.toString())

// 写入Buffer数据
buf1.write('hello')
console.log(buf1)

// 读取Buffer数据
console.log(buf1.toString())

// 合并Buffer
const buf4 = Buffer.concat([buf1, buf3]);
console.log(buf4.toString())
```
* process

#### 内置模块
内置模块不需要使用npm install 安装,但是需要使用require引入
* os
```js
const os = require('os')
const mem = os.freemem() / os.totalmem() * 100
console.log(`内存占用率${mem.toFixed(2)}%`)
```
* fs
fs是文件系统,提供了一系列操作文件的方法
```js
const fs = require('fs')
// 同步调用 readFileSync()方法
const data = fs.readFileSync('./download.js') // 返回的是Buffer
console.log(data.toString())    

// 异步调用 readFile()方法
fs.readFile('./download.js', (err, data) => {
    if (err) throw err
    console.log(data.toString())
})

// fs常常搭配path 使用
const path = require('path')
fs.readFile(path.resolve(path.resolve(__dirname, './download.js')), (err, data) => {
    if (err) throw err;
    console.log(data.toString());
});

// promisify
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
readFile('./download.js').then(data => console.log(data.toString()))

// fs Promises API node v10
const fsp = require("fs").promises;
fsp.readFile("./download.js")
    .then(data => console.log(data.toString()))
    .catch(err => console.log(err));

// async await
(async () => {
    const fs = require('fs')
    const { promisify } = require('util')
    const readFile = promisify(fs.readFile)
    const data = await readFile('./download.js')
    console.log('data', data.toString())
 })()
```
* path
* http
http: 用于创建web服务器的模块
```js
// 创建一个http服务器
const http = require('http')
const server = http.createServer((request, response) => {
    console.log('there is a request come in')
    response.end('a response from server')
})
server.listen(3000)
```
有路由控制的简单web服务器
```js
const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
    // request 和 response 都是stream流
    const {url, method} = request
    if (url === '/' && method === 'GET') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type':'text/plain;charset=utf8'})
                response.end('500 服务器错误')
                return
            }
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/html')
            response.end(data)
        })
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/plain;charset=utf8')
        response.end(' 404 not found')
    }
})
server.listen(8080)
```
编写一个请求接口
```js
if (url === '/users' && method == 'GET') {
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify([
        {
            name: 'tom',
            age: 20
        }
    ]))
}
```
* event
* stream
流（stream）是 Node.js 中处理流式数据的抽象接口。 stream 模块用于构建实现了流接口的对象。
流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。
Node.js 创建的流都是运作在字符串和 Buffer（或 Uint8Array）上。 当然，流的实现也可以使用其它类型的 JavaScript 值（除了 null）。 这些流会以“对象模式”进行操作。
```js
const stream = require('stream')
```

```js
//  创建输入输出流
const rs = fs.createReadStream('./config.js')
const ws = fs.createWriteStream('./config.js')

// 图片操作
const rs2 = fs.createReadStream('./01.png')
const ws2 = fs.createReadStream('./new.png')
rs2.pipe(ws2) // 将可读流 对接 可写流, (实现复制01.png为new.png)

// 响应图片请求
const { url, method, headers } = request
if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
    fs.createReadStream('.' + url).pipe(response)
}
/*
Accept代表发送端(客户端)希望接受的数据类型。 比如:Accept:text/xml; 代表客户端希望
接受的数据类型是xml类型。
Content-Type代表发送端(客户端|服务器)发送的实体数据的数据类型。 比如:Content-
Type:text/html; 代表发送端发送的数据格式是html。
二者合起来, Accept:text/xml; Content-Type:text/html ,即代表希望接受的数据类型是xml格
式,本次请求发送的数据的数据格式是html。
*/
```
使用流实现了一个 HTTP 服务器
```js
const http = require('http');

const server = http.createServer((req, res) => {
    // req 是一个 http.IncomingMessage 实例，它是可读流。
    // res 是一个 http.ServerResponse 实例，它是可写流。
    let body = '';
    // 接收数据为 utf8 字符串，
    // 如果没有设置字符编码，则会接收到 Buffer 对象。
    req.setEncoding('utf8');
    // 如果添加了监听器，则可读流会触发 'data' 事件。
    // 把数据流分成一块一块来传输,这其中一块就用chunk表示
    req.on('data', (chunk) => {
        body += chunk;
    });
    // 'end' 事件表明整个请求体已被接收。 
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            // 响应信息给用户。
            res.write(typeof data);
            res.end();
        } catch (er) {
            // json 解析失败。
            res.statusCode = 400;
            return res.end(`错误: ${er.message}`);
        }
    });
});
server.listen(1337);
```

#### 第三方模块
第三方模块需要npm install, 然后require
```js
// download-git-repo 用于下载git代码库
// ora 命令行出现图形化loading
const download = require('download-git-repo')
const ora = require('ora')
const process = ora(`下载.....项目`)
process.start()
download('github:su37josephxia/vue-template', 'test', err => {
    if (err) {
        process.fail()
    } else {
        process.succeed()
    }
})
```
#### 自定义模块
自定义模块导出: module.exports = {}
自定义模块导入: require()
```js
// 自定义模块导出
// promisify 用于返回promise对象
// 让异步任务串行化, await async
module.exports.clone = async function (repo, desc) {
    const { promisify } = require('util')
    // 使用promisify包裹 返回 promise对象.
    const download = promisify(require('download-git-repo'))
    const ora = require('ora')
    const process = ora('下载项目...开始')
    process.start()
    try {
        await download(repo, desc)
    } catch (error) {
        process.fail()
    }
    process.succeed()
}
```
```js
// 自定义模块导入
const { clone } = require('./download')
clone()
```

# 自己实现一个vue-auto-router-cli
vue-auto-router-cli: 根据路由目录结构生成路由配置文件.

## 项目准备
* mkdir vue-auto-router-cli
* cd vue-auto-router-cli
* npm init -y 生成package.json

* 安装要使用的第三方模块
```bash
# 命令行操作工具
npm install commander -S 
# 下载git库工具
npm install download-git-repo -S 
# 命令行进度条图形化显示工具
npm install ora -S
# 模板引擎,用于生成代码
npm install handlerbars -S
# 命令行文字颜色设置
npm install chalk -S 
```
## 代码
1. 新建文件夹bin,存放shell命令脚本文件kkb, kkb-init, kkb-refresh(不需要后缀名)
bin/kkb
```js
#!/usr/bin/env node
const program = require('commander')
program.version(require('../package').version)
    .command('init <name>', 'init project')
    .command('refresh', 'refresh routes...')
program.parse(process.argv)
```

bin/kkb-init
```js
#!/usr/bin/env node
const program = require('commander')
const {clone } = require('../lib/download.js')
const repo = 'github:su37josephxia/vue-template'
const des = 'test'

program.action(async name => {
    console.log('创建项目: ' + name)
    await clone(repo, des)
})

program.parse(process.argv)
```

bin/kkb-refresh
```js
#!/usr/bin/env node

const program = require('commander')
const symbols = require('log-symbols')
const chalk = require('chalk')

program.action(() => {
    console.log('refresh...')
})
program.parse(process.argv)

// 读取文件夹中有多少文件
const fs = require('fs')
const handlebars = require('handlebars')

const list = fs.readdirSync('./src/views')
    .filter(v => v != 'Home.vue')
    .map(v => ({
        name : v.replace('.vue', '').toLowerCase(),
        file : v
    }))
function compile(meta, filePath, templatePath) {
    if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath).toString()
        const result = handlebars.compile(content)(meta)
        fs.writeFileSync(filePath, result)
    }
    console.log(symbols.success, chalk.green(`${filePath}创建成功`))
}
compile({list}, './src/router.js', './template/router.js.hbs')
compile({list}, './src/App.vue', './template/App.vue.hbs')
```

2. 新建文件夹lib,新建文件download.js用于下载git库
lib/download.js

```js
const download = require('download-git-repo')
const { promisify } = require('util')
const ora = require('ora')
// const repo = 'github:su37josephxia/vue-template'
// const des = 'test'
const downPromise = promisify(download)
module.exports.clone = async function(repo, des) {
    let process = ora(`正在下载...${repo}`)
    process.start()
    await downPromise(repo, des)
    process.succeed()
}
```

3. 运行命令 npm link 
执行 npm link 命令,内部做了如下操作.
* 可以将执行命令当前目录下作为npm包写入到/home/richard/npm-global/lib/node_modules/下
(/home/richard/npm-global/lib/node_modules/vue-auto-router-cli -> /home/richard/Desktop/VueLearn/vue-auto-router-cli)
* 建立了软链接从/usr/local/bin/kkb ---> /home/richard/npm-global/bin/kkb,从而可以全局使用命令执行脚本.

4. 运行命令 chmod +x bin/*

5. 使用kkb init 和 kkb refresh
然后可以通过运行命令kkb init testProject,下载vue-template项目从github.每次在testProject/src/views 下新增vue文件后, 然后执行命令kkb refresh命令可以根据views下的文件自动配置router.js
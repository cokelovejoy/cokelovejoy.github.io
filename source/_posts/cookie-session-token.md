---
title: cookie session token
date: 2020-03-10 13:28:08
tags:
---

# cookie 原理

## 什么是 cookie？

cookie 指的是浏览器里面能永久存储的一种数据，仅仅是浏览器实现的一种数据存储功能。

cookie 由服务器生成，发送给浏览器，浏览器把 cookie 以键值对形式保存在本地某个目录下的文本文件内。浏览器下一次请求同一网站时会把该 cookie 发送给服务器。由于 cookie 是存在客户端上的，所以浏览器加入了一些限制确保 cookie 不会被恶意使用，同时不会占用太多磁盘空间，所以每个域的 cookie 数量是有限的。

## cookie 的构成

cookie 由浏览器保存的以下下几块信息构成：

1. 名称 Name，cookie 的名称必须经过 URL 编码。
2. 值 Value，cookie 的值是字符串，必须经过 URL 编码。
3. 域 Domain， cookie 对哪个域有效。
4. 路径 Path， 指定 cookie 对域中的哪个路径请求时，才像服务器发送 cookie。
5. 失效时间 Expires，cookie 在指定的时间之后，就不会发送 cookie。
6. 安全标志 Secure，cookie 只有使用 SSL 连接时才发送到服务器。

服务器通过设置响应头信息来指定 cookie 的配置,使用分号和空格分隔每一段。secure 标志是 cookie 中唯一一个非键值对的部分。
注意域，路径，失效时间和 secure 标志这些配置都是服务器给浏览器的指示，以指定何时如何发送 cookie，这些参数是不会作为发送到服务器的 cookie 信息的一部分。

```
Set-Cookie:name=value; domain=.coke.com; path=/; secure
```

## cookie 运作流程

用户第一次访问并登陆到一个网站的时候，cookie 的设置以及发送会经历一下 4 个步骤。

1. 客户端发送一个请求到服务器
2. 服务器发送一个 HttpResponse 响应到客户端，其中包含 Set-Cookie 的头部
3. 客户端保存 cookie，之后再向服务器发送请求时，HttpRequest 请求中会自动包含 Cookie 的头部信息
4. 服务器比对接收到的 cookie 和之前设置的 cookie，根据比对的结果返回相应的响应信息
   <img src="https://upload-images.jianshu.io/upload_images/13949989-dcf024be2733e725.png?imageMogr2/auto-orient/strip|imageView2/2/w/400/format/webp">

## cookie 特点

1. 域的限制: cookie 是基于浏览器的，不同的浏览器，cookie 不能共享，Cookie 是不可以跨域名的，隐私安全机制禁止网站非法获取其他网站的 Cookie。
2. 时间限制: cookie 的默认生命周期是会话周期，即浏览器窗口关闭之前，一直存在。关闭浏览器，相当于结束默认的会话，cookie 数据会自动消失，再次打开浏览器，相同页面读取数据，无法读到。cookie 的有效期，是可以设置的，使用时间戳来表示，多少秒后对应的 cookie 数据消失，数据过期后，会被浏览器自动清除掉，HTTP 请求中，仅携带有效期内的 cookie 数据，可以减少占用空间，减少 HTTP 传输的数据量。
3. 空间限制:cookie 只能存储 4kb
4. 数量限制:一个浏览器针对一个网站最多存 20 个 cookie，浏览器一般只允许存放 300 个 cookie。
5. 存储数据类型限制:cookie 只能存储字符串
6. 移动端对 cookie 的支持不好，Session 基于 cookie 实现，所以移动端常用 token。
7. 使用 httpOnly 提高安全性

由于所有的cookie都会由浏览器作为请求头发送，所以在cookie中存储大量信息会影响到特定域的请求性能。cookie信息越大，完成对服务器请求的时间也就越长。尽可能在cookie中少存储信息，以避免影响性能。
## JS 操作 cookie

cookie 本质为简单数据，基本操作仅为增删改查。

```js
// 返回当前页面的所有cookie的字符串
const cookies = document.cookie;
// 所有的键值对都是通过URL编码的，所以必须使用decodeURIComponent()解码
decodeURIComponent(xxx);
// 添加cookie, 这个新的cookie字符串会被添加到现有的cookie集合中，而不是覆盖，除非设置的cookie名已经存在
document.cookie = "name=coke";
// 推荐对设置的cookie使用URL编码
document.cookie = encodeURIComponent("name") + "=" + encodeURIComponent("coke");
```

简化 cookie 操作的功能函数

```js
const CookieUtil = {
  // 根据name获取cookie值
  get: function (name) {
    const cookieName = encodeURIComponent(name) + "=";
    let cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      );
    }
    return cookieValue;
  },
  // 设置cookie
  set: function (name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + "=" + encodeComponent(value);
    if (expires instanceof Date) {
      cookieText += "; expires=" + expires.toGMTString(); // 转换成GMT时间
    }
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure";
    }
    document.cookie = cookieText;
  },
  // 删除cookie，需要使用相同的路径，域和安全选项，将失效时间设置为过去的时间，才能删除cookie
  unset: function (name, path, domain, secure) {
    this.set(name, "", newDate(0), path, domain, secure);
  },
};
```

## 使用场景

- 会话状态管理（如用户登录状态、购物车、游戏分数和其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为）

# session 原理

## 什么是 session？

session 是另一种记录服务器和客户端会话状态的机制。

session 字面意思是会话，当浏览器访问服务器时，服务器为了标识当前访问的客户端，就给当前的浏览器访问，设置了一个'身份标识'，这个身份标识，我们就称之为 session，一个 session 就对应了一个浏览器窗口的访问，只允许当前这个 session 对应的浏览器访问，就算是在同一个机器上新启的浏览器也是无法访问的。而另外一个浏览器也需要记录 session 的话，就会再启一个属于自己的 session。然后客户端每次向服务器发请求的时候，都会带上 session，服务器就知道这个请求来自谁了。客户端保存这个'身份标识',可以有很多种方式，对于浏览器客户端，都默认采用 cookie 的方式。

服务器会开辟一块内存来存储 session，把用户的信息临时保存在服务器上，用户离开网站后 session 会被销毁。

## session 运作流程

1. 用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session，然后保存 Session 在内存中（或者 redis）然后给这个 session 生成一个唯一的标识字符串，然后在响应头中设置这个唯一标识字符串（SessionID）。
2. 请求返回时将此 Session 的唯一标识信息 SessionID 返回浏览器
3. 浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 cookie 中，同时 cookie 记录此 SessionID 属于哪个域名。（这是 cookie 的特性，域名限制）
4. 当用户第二次访问服务器的时候， 请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务器，服务器会从 Cookie 中获取 SessionID，在根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失败，如果找到 Session 证明用户已经登录可以执行后面的操作。

因此 SessionID 是连接 cookie 和 Session 的一道桥梁，大部分系统也是根据此原理来验证用户登录状态。

## session 特点

session 基于 cookie 实现的，session 信息存储在服务器端，sessionID 会被存储到客户端的 cookie 中，服务器端根据 SessionID 找 session。

关闭浏览器不会导致 session 被删除，迫使服务器为 seesion 设置了一个失效时间，当距离客户端上一次使用 session 的时间超过这个失效时间时，服务器就可以认为客户端已经停止了活动，才会把 session 删除以节省存储空间。

服务器无法知道浏览器是否关闭，浏览器关闭只是 cookie 被清除了，导致找不到 sessionID 了，如果将 cookie 保存在硬盘，那么即使浏览器关闭后再新开一个浏览器窗口访问服务器，也能通过 sessionID 找到 session，但是 session 也有过期时间，也可以在服务器端主动删除。

## 问题

1. 将 session 存储在服务器里面，当用户同时在线量比较多时，这些 session 会占据较多的内存，需要在服务端定期的去清理过期的 session。(思考解决的方法）
2. 当网站采用集群部署的时候，会遇到多台 web 服务器之间如何做 session 共享的问题。因为 session 是由单个服务器创建的，但是处理用户请求的服务器不一定是那个创建 session 的服务器，那么该服务器就无法拿到之前已经放入到 session 中的登录凭证之类的信息了。
3. 当多个应用要共享 session 时，除了以上问题，还会遇到跨域问题，因为不同的应用可能部署的主机不一样，需要在各个应用做好 cookie 跨域的处理。
4. sessionID 被保存在 cookie 中，浏览器端禁止使用 cookie，必须有其他机制以便在 cookie 被禁止时仍然能够把 sessionID 传递回服务器。经常被使用的一种技术叫做 URL 重写，就是把 sessionID 直接附加在 URL 路径的后面，附加方式也有两种：
   一种是作为 URL 路径的附加信息
   http://...../xxx;sessionid=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764
   另一种是作为查询字符串附加在 URL 后面，表现形式为
   http://...../xxx?jsessionid=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764
5. 移动端对 cookie 的支持不好，session 基于 cookie 实现，所以移动端常用 token。

## 比较 Cookie 和 Session

- 安全性： Session 比 Cookie 更安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。
- 存储值得类型不同： Cookie 只能存储字符串数据，要设置其他类型的数据，需要将其转换成字符串，Session 可以存储任意类型的数据，
- 存储大小不同： 单个 Cookie 保存的数据不能超过 4kb，Session 可存储的数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。

# token 令牌

## 早期基于服务器的验证

由于 HTTP 协议是无状态的，这意味着程序需要验证每一次请求，从而辨别客户端的身份。
早期程序都是通过在服务器存储登录信息来辨别请求的，这种方式一般都是通过存储 Session 来完成的。

## 基于服务器验证方式暴露的问题

1. Session： 每次认证用户发起请求时，服务器需要去创建一个记录来存储信息。当越来越多的用户发请求，内存的开销也会不断增加。
2. 可扩展性： 在服务端的内存中使用 session 存储登录信息，伴随而来的是可扩展性问题。
3. CORS（跨域资源共享）： 当我们需要让数据跨多台移动设备上使用时，跨域资源的共享会是一个让人头疼的问题。在使用 Ajax 抓取另一个域的资源，就会出现禁止请求的情况。
4. CSRF（跨站请求伪造）

## 基于 Token 的验证原理

token 是访问资源接口（api）时，所需要的资源凭证。
基于 Token 的身份验证实现了服务器无状态化，不再需要将用户信息存在服务器，因为信息就存在 token 中，服务器端通过解析 token 就可以拿到用户信息。
简单的 token 组成： uid（用户唯一的身份标识），time（当前时间的时间戳）， sign（签名，token 的前几位以 hash 算法压缩成一定长度的十六进制字符串）。

## 基于 Token 的身份验证过程

1. 客户端使用用户名和密码请求登录。
2. 服务端收到请求，去验证用户名和密码（查询数据库）。
3. 验证成功后，服务端会签发一个 token 并把 token 发送给客户端。
4. 客户端收到 token 以后，会把它存储起来，比如放在 cookie 或者 localstorage 里。
5. 客户端每次向服务端请求资源的时候需要带着服务器签发的 token。
6. 服务器收到请求，然后去验证客户端请求里面带着的 token，如果验证成功，就向客户端返回请求的数据。

注意点:

- 每一次请求都需要携带 token，需要把 token 放到 HTTP 请求的 Header 里。
- 基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 token 数据。用解析 token 的计算时间换取 session 的存取空间，从而减轻服务器的压力，减少频繁的查询数据库。
- 设置服务器属性 Access-Control-Allow-Origin：\*，让服务器能接受到来自所有域的请求。
- 如果用数据库来存储 token 会导致查询时间太长，可以选择放在内存中。比如 redis 很适合 token 的查询。

## refresh token

refresh token 是专门用于刷新 Access token 的 token，如果没有 refresh token，也可以刷新 access token，但每次刷新都要用户输入登录用户名和密码，很麻烦。有了 refresh token，客户端可以以直接用 refresh token 去更新 accesstoken，无需用户进行额外的操作。

- Access token 的有效期比较短，当 Access token 由于过期而时效时，使用 refresh token 就可以获取新的 access token，只有当 refresh token 也失效了，用户就只能重新登录了。
- refresh token 及过期时间是存储在服务器的数据库中，只有在申请新的 Access token 时才会验证，不会对业务接口响应时间造成影响，也不需要向 session 一样一直保持在内存中。

## token 的特点

- 无状态
  在客户端存储的 token 是无状态的，不需要存储 session 信息，负载均衡器能将用户信息从一个服务传到其他服务器上。
  如果是将已经验证的用户信息存储到 session 中，则每次请求都需要用户向已验证的服务器发送验证信息，用户量大时，会造成拥堵。
- 安全性
  请求中发送 token 而不是 cookie 能够防止 CSRF 跨站请求伪造。即使在客户端使用 cookie 存储 token，cookie 也只是一个存储机制，而不是用于认证。也不讲用户信息存储在 session 中，少了对 session 的操作。
  token 是由时效性的，一段时间之后用户需要重新验证。也可以手动使特定的 token 或一组相同认证的 token 无效。
- 可扩展性
  token 可以创建与其他程序共享权限的程序。
  使用 token 时，可以提供可选的权限给第三方应用。当用户想让另一应用程序访问他们的数据，我们可以通过建立 API，得出特殊权限的 token。
- 多平台跨域
  支持移动端设备，只要用户有一个通过验证的 token，数据和资源就能在任何域上被请求到。

## Token 和 Session 的比较

- session 是一种记录服务器和客户端会话状态的机制，使服务端状态化，可以记录会话信息。而 Token 是令牌，访问资源接口 API 时所需要的资源凭证，Token 使服务端无状态化，不存储会话信息。在大规模系统中，对每个请求都检索会话信息可能是一个复杂和耗时的过程，但另一方面服务端要通过 token 来解析用户身份也需要定义好相应的协议（比如 JWT）。
- session 一般通过 cookie 交互，而 token 方式更加灵活，可以是 cookie，也可以是 header，也可以放在请求的内容中。不使用 cookie 可以带来跨域上的便利性。
- token 的生成方式更加多样化，可以由第三方模块来提供。
- token 如果被盗用，服务端无法感知。cookie 信息存储在用户自己电脑中，被盗用风险略小。
- session 和 token 并不矛盾，作为身份认证 token 安全性更高，同时还可以使用 session 来在服务端保存一些状态。
- 如果用户数据需要和第三方共享，或者允许第三方调用 API 接口，用 token，如果永远只是自己的网站，自己的 app，都可以。

# JWT（JSON WEB TOKEN）

JSON Web Token （简称 JWT）是目前最流行的跨域认证解决方案。JWT 是一种认证授权机制。

## 跨域认证问题

互联网用户认证的一般流程如下：

1. 用户想服务器发送用户名和密码。
2. 服务器验证通过后，在当前对话（session）里面保存相关数据。比如用户角色，登录时间等。
3. 服务器向用户返回一个 sessionID，写入用户的 Cookie 中。
4. 用户随后的每一次请求，都会通过 Cookie，将 sessionID 传回服务器。
5. 服务器收到 SessionID，找到前期保存的数据，由此得知用户的身份。

这种模式的产生的问题：扩展性不好，如果是服务器集群或者是跨域的服务器导向架构，就要求 session 数据共享，每台服务器都能够读取到 session。例如，要求用户在一个网站登录，在访问另一个网站就会自动登录，如何实现？（实现单点登录 sso）

一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都想持久层请求数据。这种方案的优点是架构清晰，缺点是工程量大，另外持久层挂了，就会单点登录失败。

另一种方案就是服务器不保存 session 数据，所有数据（就是 token）都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。

## JWT 原理

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户。如下：

```
{
    "name": "coke",
    "role": "admin",
    "expireTime": "2020.02.02"
}
```

以后，用户与服务器端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认证用户身份。为了防止用户篡改数据，服务器在生成这个 JSON 对象的时候，会进行签名操作。

服务器就不保存 session 数据了，也就是说，服务器变成无状态的了，从而比较容易实现扩展。

## JWT 的数据结构

实际的 JWT 就像是下面这样：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwicGFzc3dvcmQiOiIxMTExMTEifSwiZXhwIjoxNTU3MTU1NzMwLCJpYXQiOjE1NTcxNTIxMzB9.
pjGaxzX2srG_MEZizzmFEy7JM3t8tjkiu3yULgzFwUk
```

它是一个很长的字符串，中间用点（.）分隔成三个部分。注意，JWT 内部是没有换行的，此处方便展示，将它写成几行。
JWT 的三个部分依次是：

1. Header(头部)
2. Playload（负载）
3. Signature（签名）

### Header

Header 部分是一个 JSON 对象，描述了 JWT 的元数据，通常如下：

```
{
    "alg": "HS256",
    "typ": "JWT"
}
```

其中 alg 属性表示签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256）,typ 属性表示这个令牌（token）的类型，JWT 令牌统一写成 JWT。

最后，将上面的 JSON 对象使用 Base64URL 算法转成字符串。

### Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据.JWT 规定了 7 个官方字段，供选用。

```
iss(issuer): 签发人
exp(expiration time): 过期时间
sub(subject): 主题
aud(audience): 受众
nbf(Not Before): 生效时间
iat(Issued At): 签发时间
jti(JWT ID): 编号
```

还可以自定义私有字段：

```
{
    "name": "coke",
    "admin": true
}
```

注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。
这个 JSON 对象也要使用 Base64URL 算法转成字符串。

### Signature

Signature 部分是对前两部分的签名，防止数据篡改。
首先，需要制定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

```
HMACSHA256(
    base64UrlEncode(header) + "." +
    baseUrlEncode(payload),
    secret
)
```

算出签名以后，把 Header，Payload，Signature 三个部分拼成一个字符串，每个部分之间用"点"(.)分隔，就可以返回给用户。

### 验证

默认使用 HS256 算法对 JWT 中的 Header 和 Payload 数据签名,然后将产生的结果和 JWT 中的 Signature 数据比对.

### Base64URL

Base64 内容传送编码被设计用来把任意序列的 8 位字节描述为一种不易被人识别的形式.
Header 和 Payload 串行化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但是有一些小的不同。

JWT 作为一个令牌（token），有些使用场景可能会放到 URL 中（如 api/example/?token=xxx）.Base64 算法中有三个字符+,/,=在 URL 中有特殊含义，因此要被替换掉，=被省略，+号替换成-，/替换成\_,这就是 Base64URL 算法。

### HMAC SHA156

HMAC（Hash Message Authentication Code），散列消息鉴别码，实现鉴别的原理，用公开函数和密钥产生一个固定长度的值作为认证表示，用这个标识鉴别消息的完整性。使用一个密钥生成一个固定大小的小数据块，即 MAC，并将其加入到消息中，然后传输。接收方利用与发送方共享的密钥进行鉴别认证。

### Beare

Beare 作为一种认证类型(基于 OAuth 2.0),使用"Bearer"关键词进行定义.
当用户希望访问一个受保护的路由或者资源的时候,需要请求头的 Authorization 字段中使用 Bearer 模式添加 JWT,如下

```
Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyy.zzzzzzzzzzzzzzzzzzzzzzzzz
```

## JWT 的认证流程

1. 用户输入用户名、密码的登录，服务器认证成功后，会返回给客户端一个 JWT。
2. 客户端收到服务器返回的 JWT，可以存储在 Cookie 中，也可以存储在 localStorage。
3. 当用户希望访问一个受保护的路由或者资源的时候，需要请求头的 Authorization 字段中使用 Bearer 模式添加 JWT。
4. 服务端的保护路由将会检查请求头 Authorization 中的 JWT 信息，如果合法，则允许用户的行为。
5. 因为 JWT 是包含了一些会话信息的，因此减少了需要查询数据库的需要。
6. JWT 并不使用 Cookie，因此可以使用任何域名提供 API 服务，而不需要担心跨域资源共享的问题。

此后，客户端每次与服务器通信，都要带上这个 JWT。可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求头 Authorization 字段里面。

另一种做法就是 JWT 就放在 POST 请求的数据体里面。

## JWT 的特点

1. JWT 默认是不加密的，但是也可以再加密。生成原始的 token 以后，可以用密钥在加密一次。
2. JWT 不加密的情况下，不要将私密数据写入 JWT。
3. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
4. JWT 的最大缺点就是，由于服务器不保存 session 状态，因此无法在使用的过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器手动终止。
5. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
6. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

## JWT 和 token 的比较

相同：

- 都是访问资源的令牌
- 都可以记录用户信息
- 都是使服务端无状态化
- 都是只有验证成功后，客户端才能访问服务端上受保护的资源。

区别：

- token： 服务端验证客户端发送过来的 token 时，还需要查询数据库获取用户信息，然后验证 token 是否有效。
- JWT： 将 token 和 Payload 加密后存储在客户端，服务端只需要使用相同的加密算法加密 header 和 payload，然后比对 Signature，进行校验。不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。

# hash 算法

哈希算法（Hash Algorithm）又称散列算法，哈希函数，哈希算法将数据重新打乱混合，重新创建一个新的哈希值。
哈希算法主要用于保障数据真实性（完整性），即发信人将原始消息和哈希值一起发送，收信人通过相同的 hash 算法来校验原始数据是否真实。
哈希算法的特点： 不定长数据转换成定长数据，雪崩效应， 防篡改。

# 常用的鉴权的几种方式

## Cookie/Session 方式

### 设置 Cookie

```js
const http = require("http");
http
  .createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      res.end("");
      return;
    }
    // 观察cookie 存在， 如果有cookie，发送请求时，浏览器会自动带上cookie
    console.log("cookie:", req.headers.cookie);
    // Header Set-Cookie用于设置cookie
    res.setHeader("Set-Cookie", "cookie1=abc");
    res.end("hello cookie!!");
  })
  .listen(3000, () => {
    console.log("listen on port 3000");
  });
```

### 设置 session

```js
const http = require("http");
const session = {};
http
  .createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      res.end("");
      return;
    }
    // 观察cookie存在
    console.log("cookie", req.headers.cookie);
    const sessionKey = "SessionID";
    const cookie = req.headers.cookie;
    // cookie中存在sessionID
    if (cookie && cookie.indexOf(sessionKey) != -1) {
      // 简略处理
      res.end("have log in");
      const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`);
      const sid = pattern.exec(cookie)[1];
      console.log("session:", sid, session, session[sid]);
    } else {
      // 生成随机sessionID
      const sid = (Math.random() * 99999999).toFixed();
      // 将sessionID保存到cookie中
      res.setHeader("Set-Cookie", `${sessionKey}=${sid};`);
      // 设置session保存用户信息
      session[sid] = { name: "coke", age: 22 };
      res.end(`Hello ${sid}`);
    }
  })
  .listen(3000, () => {
    console.log("listen on port 3000");
  });
```

### 在 Koa 中使用 session： npm i koa-session -S

```js
const Koa = require("koa");
const app = new Koa();
const session = require("koa-session");

// 签名keys作用： 用来对cookie进行签名
app.keys = ["some secret"];
// 配置项
const SESS_CONFIG = {
  key: "sessionID",
  maxAge: 86400000, // 设置有效时间，默认一天
  httpOnly: true, // 仅限服务器修改
  signed: true, // 签名cookie,防止前端篡改数据
};
// 注册session中间件
app.use(session(SESS_CONFIG, app));

// 测试
app.use((ctx) => {
  if (ctx.path === "/favicon.ico") return;
  // 获取
  let count = ctx.session.count || 0;
  // 设置 session
  ctx.session.count = ++count;
  ctx.body = "第" + count + "次访问";
});

app.listen(3000, () => {
  console.log("listen on port 3000");
});
```

### 应用

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <div id="app">
      <div>
        <input type="text" v-model="username" />
        <input type="text" v-model="password" />
      </div>
      <div>
        <button @click="login">Login</button>
        <button @click="logout">Logout</button>
        <button @click="getUserInfo">GetUserInformation</button>
      </div>
      <div>
        <button onclick="document.getElementById('log').innerHTML = ''">
          Clear Log
        </button>
      </div>
    </div>
    <h6 id="log"></h6>
    <script>
      axios.default.withCredentials = true;
      axios.interceptors.response.use((response) => {
        document.getElementById("log").append(JSON.stringify(response.data));
        return response;
      });
      var app = new Vue({
        el: "#app",
        data: {
          username: "test",
          password: "test",
        },
        methods: {
          async login() {
            await axios.post("/users/login", {
              username: this.username,
              password: this.password,
            });
          },
          async logout() {
            await axios.post("/users/logout");
          },
          async getUserInfo() {
            await axios.get("/users/getUser");
          },
        },
      });
    </script>
  </body>
</html>
```

index.js

```js
const Koa = require("koa");
const router = require("koa-router")();
const session = require("koa-session");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const app = new Koa();

// 配置session的中间件
app.use(
  cors({
    credentials: true,
  })
);

// 只有服务器端知道的密钥，用于签名
app.keys = ["some secret"];

app.use(static(__dirname + "/"));
// 注册中间件 bodyParser
// 用于将 post请求中的数据变成对象保存在ctx.request.body
app.use(bodyParser());

// 注册session中间件
app.use(session(app));

app.use((ctx, next) => {
  // 除了login路由不用检查session，其余路由需要检查session
  if (ctx.url.indexOf("login") != -1) {
    next();
  } else {
    console.log("session", ctx.session.userinfo);
    if (!ctx.session.userinfo) {
      ctx.body = {
        message: "登录失败",
      };
    } else {
      next();
    }
  }
});

router.post("/users/login", async (ctx) => {
  const { body } = ctx.request;
  console.log("body", body);
  // 登录时，设置session的信息
  ctx.session.userinfo = body.username;
  ctx.body = {
    message: "登录成功",
  };
});

router.post("/users/logout", async (ctx) => {
  // 设置session
  delete ctx.session.userinfo;
  ctx.body = {
    message: "登出系统",
  };
});

router.get("/users/getUser", async (ctx) => {
  ctx.body = {
    message: "获取数据成功",
    userinfo: ctx.session.userinfo,
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```

### 使用 redis 存储 session

#### redis 介绍

redis 是一个高性能的 key-value 数据库。
Redis is an in-memory database that persists on disk. The data model is key-value, but many different kind of values are supported: Strings, Lists, Sets, Sorted Sets, Hashes.

### Redis 与其他的缓存产品有以下三个特点

- Redis 支持数据的持久化，可以将内存中的数据保存在磁盘，重启的时候可以再次加载进行使用。
- Redis 不仅仅支持简单的 key-value 类型的数据，同时还提供 list，set，zset，hash 等数据结构的存储。
- Redis 支持数据的备份，即 master-slave 模式的数据备份。

### Redis 优势

- 性能极高-Redis 能读的速度是 110000 次/s, 写的速度是 81000 次/s。
- 丰富的数据类型- Redis 支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作。
- 原子 - Redis 的所有操作都是原子性的，意思就是要么成功执行，要么失败完全不执行。单个操作是原子性的。多个操作也支持事务，即原子性，通过 MULTI 和 EXEC 指令包起来。
- 丰富的特性 - Redis 还支持 publish/subscribe, 通知 key 过期等特性。

### 使用 redis

#### windows 安装 redis

下载地址： https://github.com/MSOpenTech/redis/releases

#### 启动 redis

打开 cmd 窗口使用 cd 命令切换到 redis 安装目录运行如下命令

```bash
redis-server.exe
```

#### 使用 redis 模块操作 redis

安装 redis 模块

```bash
npm i redis -S
```

使用 redis

```js
const redis = require("redis");
const client = redis.createClient(6379, "localhost");

client.set("hello", "this is a value");

client.get("hello", (err, value) => {
  console.log("redis get", value);
});
```

### 使用 koa-redis

安装：npm i -S koa-redis
配置使用

```js
const Koa = require("koa");
const app = new Koa();

const session = require("koa-session");

const redisStore = require("koa-redis");
const redis = require("redis");
const redisClient = redis.createClient(6379, "localhost");

const wrapper = require("co-redis");
const client = wrapper(redisClient);

app.keys = ["some secret"];

const SESS_CONFIG = {
  key: "richard:session",
  store: redisStore({ client }),
};

app.use(session(SESS_CONFIG, app));

app.use((ctx) => {
  // 查看redis
  redisClient.keys("*", (err, keys) => {
    console.log("keys: ", keys);
    keys.forEach((key) => {
      redisClient.get(key, (err, val) => {
        console.log(val);
      });
    });
  });
  if (ctx.path === "/favicon.ico") return;
  let n = ctx.session.count || 0;
  ctx.session.count = ++n;
  ctx.body = "第" + n + "次访问";
});

app.listen(3000);
```

## Token 认证

- 登录页 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <div>
        <input type="text" v-model="username" />
        <input type="text" v-model="password" />
      </div>
      <div>
        <button @click="login">Login</button>
        <button @click="logout">Logout</button>
        <button @click="getUser">GetUser</button>
      </div>
      <div>
        <button @click="logs=[]">Clear Log</button>
      </div>
      <!-- log -->
      <ul>
        <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
      </ul>
    </div>
    <script>
      // 请求拦截器
      // 判断是否存在token，如果存在token，每个http请求的Header都加上token
      // Bearer 是JWT认证的头部信息
      axios.interceptors.request.use(
        (config) => {
          const token = window.localStorage.getItem("token");
          if (token) {
            config.headers.common["Authorization"] = "Bearer " + token;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );
      axios.interceptors.response.use(
        (response) => {
          app.logs.push(JSON.stringify(response.data));
          return response;
        },
        (err) => {
          app.logs.push(JSON.stringify(response.data));
          return Promise.reject(err);
        }
      );
      var app = new Vue({
        el: "#app",
        data: {
          username: "test",
          password: "test",
          logs: [],
        },
        methods: {
          login: async function () {
            const res = await axios.post("/users/login-token", {
              username: this.username,
              password: this.password,
            });
            localStorage.setItem("token", res.data.token);
          },
          logout: async function () {
            localStorage.removeItem("token");
          },
          getUser: async function () {
            await axios.get("/users/getUser-token");
          },
        },
      });
    </script>
  </body>
</html>
```

- 登录接口(服务端)
- 安装依赖： npm i jsonwebtoken koa-jwt -S
- 接口编写 index.js

```js
const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");

const secret = "it's a secret";

app.use(bodyParser());
app.use(static(__dirname + "/"));

router.post("/users/login-token", async (ctx) => {
  const { body } = ctx.request;
  // 登录逻辑, 验证账户和密码，假设验证成功
  // 设置session
  const userinfo = body.username;
  ctx.body = {
    message: "登录成功",
    user: userinfo,
    // 服务器端生成的token 返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        // 设置token过期时间，一小时后，秒为单位
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      secret
    ),
  };
});
router.get("/users/getUser-token", jwtAuth({ secret }), async (ctx) => {
  // 验证通过， state.user
  console.log(ctx.state.user);
  // 获取session
  ctx.body = {
    message: "获取数据成功",
    userinfo: ctx.state.user.data,
  };
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```

## Oauth 第三方授权登录

### 概述

第三方登录主要是基于 OAuth 2.0。OAuth 协议为用户资源的授权提供了一个安全的，开放而又简易的标准。与以往的授权方式不同之处是 OAuth 的授权不会使第三方触及到用户的账号信息（如用户名和密码），即第三方无需使用用户的用户名与密码就可以申请获得该用户资源的授权，因此 OAuth 是安全的。

### 应用

使用 github 提供的第三方登入接口。

### 配置 github，申请一个 OAuth App

1. 先注册登录 github
2. 点击头像下的 Settings ---> 点击 Developer settings ---> 点击右侧 New OAuth App
3. 填写申请 app 的配置:Application name,Homepage URL,Application description,Authorization callback URL
4. 最重要的两项就是 Homepage URL 和 Authorization callback URL,
   Homepage URL 这个是后续使用授权的 URL，也就是项目目录根地址。
5. Authorization callback URL 授权成功后的回调地址，github 会重定向到这个 URL 并携带 code，获取 code 后 我们才能继续获取 access_token,在进一步获取用户信息。

### 授权登录步骤

1. 服务器端重定向 https://github.com/login/oauth/authorize
2. github 端重定向到服务端，并携带了 code，保存 code
3. 根据 code 请求 github 接口https://github.com/login/oauth/access_token, 获取 access_token
4. 根据 access_token 请求 github 接口https://api.github.com/user?access_token=xxxxxxxxxxxx ,获取用户信息

### 登录页面 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <div id="app">
      <a href="/github/login">login with github</a>
    </div>
  </body>
</html>
```

### 登录接口(服务器)index.js

```js
const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const app = new Koa();
const axios = require("axios");
const querystring = require("querystring");

app.use(static(__dirname, "/"));
const config = {
  client_id: "0beb87ba1a33ceeb41ff",
  client_secret: "5b38b93be974d56220dd497dbec1c5d80f4f183b",
};
router.get("/github/login", async (ctx) => {
  // 重定向到认证接口，并配置参数
  var path = "https://github.com/login/oauth/authorize";
  path += "?client_id=" + config.client_id;
  // 转发到授权服务器
  ctx.redirect(path);
});

router.get("/github/callback", async (ctx) => {
  console.log("callback..");
  // github 那边重定向到当前url下，并返回了code
  const code = ctx.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code,
  };
  // 向github的接口发送请求，获取access_token
  let res = await axios.post(
    "https://github.com/login/oauth/access_token",
    params
  );
  const access_token = querystring.parse(res.data).access_token;
  // 再拿access_token去请求用户信息。
  res = await axios.get(
    "https://api.github.com/user?access_token=" + access_token
  );
  console.log("userAccess: ", res.data);
  ctx.body = `
        <h1>Hello ${res.data.login}</h1>
        <img src="${res.data.avatar_url}" alt="">
    `;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```

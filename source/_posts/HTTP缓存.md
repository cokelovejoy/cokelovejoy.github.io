---
title: HTTP缓存
date: 2020-06-22 14:33:56
tags:
---
# HTTP缓存是什么
## 背景
当浏览器加载一个页面的html时，引用的外部资源也会加载。但这些外部资源比如图片，CSS，js都不经常变化。如果每次都加载这些资源，会带来资源的浪费。而且加载时间过长也会影响用户体验。
HTTP缓存技术就是为了解决这个问题出现。HTTP缓存技术就是将静态资源存储在浏览器内部，下次请求相同的资源时可以直接使用。
如何使资源一旦更新，缓存也要随之更新，需要通过使用一些策略来保证。

## 作用
* 提高首屏加载速度，优化用户体验。
* 减少流量消耗
* 减轻服务器压力
# 强缓存策略
强缓存通过设置定时器的方式，设置静态资源的有效期，如果超过有效期就认为缓存作废，需要重新请求。
如果设置了expires和cache-control都会访问本地缓存直接验证看是否过期，如果没过期,不去请求服务器,直接使用本地缓存，并返回200。

## expires
expires是HTTP1.0 中定义的缓存字段。当请求一个资源，服务器返回时，可以在Response Headers中增加expires字段表示资源的过期时间。
expires字段的值是一个时间戳(格林尼治时间),当客户端再次请求该资源的时候，会把客户端时间与该时间戳进行对比，如果小于该时间戳则直接使用该缓存资源。如果大于该时间戳，则表示过期，缓存作废。

问题是发送请求时使用的是客户端时间去对比。客户端和服务端的时间可能快慢不一致，另一方面是客户端的时间是可以自行修改的(浏览器的时间是跟随系统的，修改系统时间会影响到)，所以不一定满足预期。
```js
// expires:  Mon, 22 Jun 2020 08:18:33 GMT
res.setHeader('Expires', new Date(Date.now() + 10*1000).toUTCString())
```
## cache-control
HTTP 1.1新增cache-control字段来解决上述客户端和服务端时间不匹配的问题，所以当cache-control 和 expires都存在时，cache-control优先级更高。该字段是一个时间长度，单位秒，表示该资源过了多少秒后失效。当客户端请求资源的时候，发现该资源还在有效时间内则使用该缓存，它不依赖客户端时间。
cache-control主要有max-age，s-maxage，public，private，no-cache，no-store等值。

* public
所有内容都将被缓存(客户端和代理服务器都可以缓存)
* private
内容只缓存到私有缓存中(客户端可以缓存)
* no-cache
需要使用协商缓存来验证缓存数据
* no-store
所有内容都不缓存
* must-revalidation/proxy-revalidation
如果缓存的内容失效，请求必须发送到服务器/代理以进行重新验证呢过
* max-age=xxx
缓存的内容将在xxx秒后失效，这个选项只有在HTTP1.1可用，如果和Last-Modified一起使用时，优先级较高。

使用
```js
res.setHeader('Cache-Control', 'max-age=20')
```
# 协商缓存
协商缓存简单的说就是浏览器和服务器间就是否要使用缓存做协商。如果协商的结果是需要更新，就返回200并更新内容。如果不需要，就只需要返回状态吗304不用返回内容，这样虽然后端需要应答，但是后端既不需要生成内容也不需要传输内容。
如果设置了no-cache和no-store则本地缓存会被忽略，会去请求服务器，验证资源是否更新，如果没更新才继续使用本地缓存，此时返回的是304，这就是协商缓存。
设置协商缓存主要包括last-modified 和 Etag。

## last-modified 和 if-modified-since
通过比较时间， 判断是否需要使用缓存
```js
res.setHeader('Cache-Control', 'no-cache')
// 设置时间
res.setHeader('last-modified', new Date().toUTCString())
// 判断是否在有效期内，req.headers['if-modified-since'] 就是last-modified设置的时间。
if (new Date(req.headers['if-modified-since']).getTime() + 10 * 1000 > Date.now()) {
    console.log('协商缓存命中')
    res.statusCode = 304
    res.end()
    return
}
```
## Etag 和 if-none-match
通过比较内容，判断是否要使用缓存
```js
const crypto = require('crypto')
const hash = crypto.createHash('sha1').update(content).digest('hex')
res.setHeader('Cache-Control', 'no-cache')
res.setHeader('Etag', hash)
// 判断服务器设置的hash和客户端请求头中携带的hash一样
// req.headers['if-none-match']就是 Etag 中的值
if (req.headers['if-none-match'] === hash) {
    console.log('Etag 缓存命中')
    res.statusCode = 304
    res.end()
    return
}
```
## AJAX缓存
## Service Worker
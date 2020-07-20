---
title: 服务端渲染SSR
date: 2020-07-20 11:55:01
tags:
---
# 传统的web开发
传统的web开发就是客户端请求服务器，服务器返回html，客户端渲染html。
# SPA
在Vue,React时代，单页面应用优秀的用户体验，逐渐成为了主流，页面整体是JS渲染出来的，称之为客户端渲染CSR。
客户端渲染的两个问题就是首屏渲染慢和不便于seo（search engine optimize）。
# SSR
为了解决上述两个问题，出现了SSR的解决方案，后端渲染出完整的首屏的DOM结构返回，前端拿到的内容包括首屏以及完整的spa结构，应用激活后依然按照spa方式运行，这种页面渲染的方式被称为服务端渲染（server side render）。
# Vue SSR 实战
## 新建工程
```bash
vue create ssr
```
## 安装依赖
```bash
npm install vue-server-renderer express -D
```
## 启动脚本
创建一个express服务器，将vue ssr集成进来
```js
// ./server/index.js
const express = require('express')
const Vue = require('vue')

```
---
title: build-with-hexo
date: 2019-10-09 18:15:25
tags: How to use hexo create a blog
---
本教程是如何使用hexo快速搭建一个个人博客！

## 搭建工作环境
Hexo基于Node.js，搭建完整的工作环境需要先安装node，npm，git。
## 全局安装Hexo
Hexo是一个博客框架，Hexo官方提供了一个命令行工具，用于快速创建项目、页面、编译、部署博客，因此先安装Hexo的命令行工具（hexo-cli）。
```bash
$ npm install -g hexo-cli
```
安装完之后，可能会出现 hexo 命令没有找到的错误，是因为还不能全局使用hexo命令，使用以下命令给hexo 建立软连接 ，之后就能使用hexo命令。
```bash
$ sudo ln -s ~/npm-global/lib/node_modules/hexo-cli/bin/hexo /usr/local/bin/hexo
```

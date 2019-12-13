---
title: Vue项目最佳实践
date: 2019-12-13 16:58:01
tags:
---

# 项目配置
## 使用Vue-cli 
<a href="https://cli.vuejs.org/zh/">Vue-Cli</a>
Vue Cli 用于快速创建Vue项目的脚手架,安装之后使用vue命令创建项目,会生成一些默认的项目目录及配置文件.

### 安装vue-cli (全局安装)
使用npm包管理器安装
```bash
npm install -g @vue/cli
```
测试vue-cli已经安装
```bash
vue --version
```
可能出现的问题: 全局安装@vue/cli之后显示没有 找不到vue命令。
解决办法: 将安装的全局包建立软连接： 
```bash
sudo ln -s /home/richard/npm-global/bin/vue /usr/local/bin/vue
```

全局安装@vue/cli后,会在/home/richard/npm-global/bin下生成vue文件.
执行以上命令后会在/usr/local/bin下生成vue文件,然后就可以在终端使用vue命令.
### 创建一个项目
```bash
vue create hello-world
```
随后可以对一些配置选项自行选择.
### 安装插件
Vue CLI 使用了一套基于插件的架构。查阅一个新创建项目的 package.json，就会发现依赖都是以 @vue/cli-plugin- 开头的。插件可以修改 webpack 的内部配置，也可以向 vue-cli-service 注入命令。在项目创建的过程中，绝大部分列出的特性都是通过插件来实现的。

```bash
vue add eslint
```
### 简单配置
创建vue.config.js, 指定应用上下文
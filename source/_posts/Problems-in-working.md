---
title: Problems in working
date: 2019-11-02 13:14:36
tags:
---

# Problems in working
此章用于总结工作中遇到的问题.

## [Vuex]:  Don't mutate vuex store state outside mutation handler
* 问题产生的原因: 
在mutations 之外改变了vuex store state中的数据,就会产生这个报错,而且 这个只会在strict: true 的时候产生.
* 配置strict:
```js
export default new Vuex.Store({
  strict: true,
  modules: {
    add: add,
    test: test
  }
})
```
* 现象:
```js
export default {
  data() {
    return {
      formModel: {
        'test': ''
      }
    }
  },
  methods: {
    changeStoreValue() {
      this.formModel['test'] = 'hello'
      console.log(this.formModel['test'])
      console.log(this.$store.state.test.storeValue)
    },
    printVal() {
      // 这种写法 改变this.formModel 也会引发 Vuex warning : Don't mutate vuex store state outside mutation handler
      // 实际上就是: arry变量 使用了 this.formModel 的引用 ,当arry 成为state后, this.formModel的值改变,arry也会跟着改变
      // 因此会引发上述的vuex warning,这种比较难发现,因此要注意.
      let arry = [this.formModel]
      // 使用以下写法
      // let arrt = [Object.assign({}, this.formModel)]
      this.$store.commit('test/setStoreValue', arry)
    }
  }
}
```
* 解决方法: 
1. state中存的是基本数据类型 boolean, string, number 重新赋值给新的变量, 通过操作新的变量达到处理数据的目的
```js
// 假设 this.$store.state.test.message = ''
let newVal = this.$store.state.test.message
```
2. state 中存的是引用数据类型, array, object (注:null 也是 object)
```js
// 假设 this.$store.state.test.message = []
// 方法一: 
// slice 方法: 会返回一个新的数组.一块新的内存空间,这样改变newArray时 不会改动this.$store.state.test.message
let newArray = this.$store.state.test.message.slice()
// 方法二: 
// Object.assign()方法 用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
let newArray = Object.assign([], this.$store.state.test.message)

// 假设 this.$store.state.test.message = {}
let newObj = Object.assign({}, this.$store.state.test.message)
```
总结:
在解决vuex store mutation的问题时,实际上就变成了对基本数据类型和引用数据类型的处理的问题.
基本数据类型string,number,boolean在赋值之后,会分配一块新的内存空间来存储值,因此改变新的变量和原来的变量相互不影响.
引用数据类型array,object,在赋值操作之后, 并不会分配一块新的内存空间,而是将旧的变量的引用(也可以叫内存地址)赋给新的变量,因此新旧两个变量改变时,会互相影响. 因此在编程时,要尤其注意,修改一个对象或数组后,要考虑是否会改变原来的值,原来的值在之后使用可能又会影响其他的值.所以我们要操作一个引用型的数据时要做一个副本的拷贝的工作,以保证原来的值不会以一种难以发现的方式被修改,以致于混乱。

# problems-in-work
Be used to record problems in working


# vuetify
Vuetify 设置v-flex 内容(图片文字)垂直居中， 使用 d-flex 和 align-center
ex: <v-flex d-flex align-center></v-flex>

# ssh
Your identification has been saved in /home/richard/.ssh/id_rsa.
Your public key has been saved in /home/richard/.ssh/id_rsa.pub.
password:123456

# git操作

## 本地创建git仓库
git init
## 创建远程仓库
git remote add origin git@github.com:cokelovejoy/cokelovejoy.github.io.git
(创建 名为origin的远程仓库, 该远程仓库连接到github地址的代码库)
git push -u origin master (将本地的master分支推送到origin主机，同时指定origin为默认主机)
## 拉取远程仓库代码到本地
git pull origin master

## 创建本地分支并切换
git checkout -b dev
git checkout -b dev origin/dev 
## 拉取远程仓库代码
git pull origin dev

## 分支操作
git branch （查看当前分支）
git branch -r（查看远程分支）
git branch -a (查看所有分支)
git branch --set-upstream-to=origin/远程分支名 本地分支名 (git 将本地分支关联到远程分支)
git checkout dev （切换到已经存在的分支）
git checkout -b dev （在本地创建新分支，并切换到该分支）
git checkout -b dev origin/dev (基于远程origin/dev分支新建本地dev分支)

## 拉取,提交操作
git pull (将远程分支上的代码拉到本地)
git add -A
git commit -m'xxxx'
git push origin xxxbranch-name
git push -u origin master 命令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了。
git push --set-upstream origin dev-01(当远程没有该分支的时候，会在远程库里创建这个分支如dev-01,然后再推送文件，origin 是远程主机名)
git push origin dev-branch（origin表示远程主机名， dev-branch表示本地分支名）
git push origin（如果当前分支与远程分支存在追踪关系，则本地分支和远程分支都可以省略，将当前分支推送到origin主机的对应分支）
git push（如果当前分支只有一个远程分支，那么主机名都可以省略，形如 git push，可以使用git branch -r ，查看远程的分支名）
## 解决冲突
git add file-name之后，如果取消add 使用git reset file-name即可
git commit -m 'message' 之后，如果要取消 commit
先使用git log 查看commit 历史记录
然后使用 git reset 404b1f29b3066ec19b07c3ddf76510d97c5643b1
（倒数第二次记录的commit哈希值），即可恢复到上一次commit。

## pull request merge conflict
当pull request 为branch1 指向 branch2 时，发生冲突，需要解决冲突，将branch2 的代码 pull到brach1,在branch1上解决冲突，保留branch2上的代码。然后提交。
之后再在branch1上做修改，把原来的冲突代码写回来。branch2 的代码始终不能改变的。
step1： 拉取远程分支branch2的代码，然后合并到branch1，然后解决冲突。
git checkout branch1
git pull origin branch2
step2：提交改变，add，commit，push,然后 branch2 的代码 就会合并到branch1上。
git add -a
git commit -m'xxx'
git push origin HEAD   // HEAD为当前分支的简称



## 查看信息
git log （查看commit提交记录）
git status （查看本地库文件的更改状态）
git diff （显示提交之间、提交和工作区之间等的差异）
git remote -v （显示对应的克隆地址）
git remote （列出每个远程库的简短名字。在克隆完某个项目后，至少可以看到一个名为 origin 的远程库，Git 默认使用这个名字来标识你所克隆的原始仓库）
git remote show origin (查看某一个远程仓库的更多信息)

## merge用法
一, 开发分支(dev)上的代码达到上线的标准,合并到master分支
git checkout dev
git pull
git checkout master
git merge dev
git push -u origin master

二,当master代码改动了,需要更新开发分支(dev)上的代码
git checkout master
git pull
git checkout dev
git merge master
git push -u origin dev

## 暂存
git stash 
git stash pop
## 配置config 
git config --global user.name 'richard'
git config --global user.email '847035485@qq.com'
git config --list

工作笔记 ：
# 软链接
全局安装@vue/cli之后显示没有 找不到vue命令。
解决方法： 将安装的全局包建立软连接： sudo ln -s /home/richard/npm-global/bin/vue /usr/local/bin/vue
建立成功会在/usr/local/bin/vue下生成vue文件。

# 箭头函数
箭头函数内的this,在定义的时候决定的.绑定定义时所在的作用域的this.
其他函数 的this ,是使用的时候所在的作用域的this.
箭头函数不能用于构造函数.

# rest
rest参数, 把实参放入到数组中
...arr
function fn(...arr) {
	console.log(arr)
}
fn(1,2,3) 
不用再使用arguments
# 对象合并
Object.assign(target, source)

# 扩展运算符
数组的扩展
let arr = [1,2,3]
let arr2 = [...arr]
对象的扩展
let obj1 = {a:1}
let obj2 = {b:2}
let obj = {...obj1,...obj2}

# 数组的方法
ES5方法
map() , filter(), reduce(), every(), some()

ES6方法
find(), findIndex()

//find 找到符合条件的第一个.
let arr = [1,2,3,4,5,6]
arr.find(function(item,index){
	return item <3
})

indexOf()方法 返回字符串,或数组中某个值第一次出现的index,没有返回-1
let a= [1,2,3,4]
a.indexOf(4) //3

查找使用includes() 代替indexOf() 效率更高
# $nextTick
Vue $nextTick():
主要用于数据改变之后需要操作DOM,DOM操作作为回调函数写入$nextTick()

# vuex store
Vuex store中的数据在页面刷新后会消失,如果要让它不消失,需要使用插件将对store中的数据做持久化操作,在页面刷新之前保存到localStorage.

# Mouse Event
Mouse Event 对象的属性clengtX和pageX和screenX和offsetX的区别:
clientX 设置或获取鼠标指针位置相对于浏览器内容窗口的 x 坐标，其中客户区域不包括窗口自身的控件和滚动条。

clientY 设置或获取鼠标指针位置相对于浏览器内容窗口的 y 坐标，其中客户区域不包括窗口自身的控件和滚动条。
(跟screenX相比就是将参照点改成了浏览器内容区域的左上角，该参照点会随之滚动条的移动而移动，也就是说，他计算left或top时直接忽略了滚动条的高和宽，它的参考点是浏览器可见区域的左上角，而不是页面本身的body左上角原点，计算数值和滚动条是否滚动没有关系，只是绝对的计算鼠标点距离浏览器内容区域的左上角的距离，忽略了滚动条的存在)

offsetX 设置或获取鼠标指针位置相对于触发事件的对象的 x 坐标。
offsetY 设置或获取鼠标指针位置相对于触发事件的对象的 y 坐标。

screenX 设置或获取获取鼠标指针位置相对于用户屏幕的 x 坐标。
screenY 设置或获取鼠标指针位置相对于用户屏幕的 y 坐标。

pageX：参照点是页面本身左上角的原点.已经把滚动条滚过的高或宽计算在内.

所以基本可以得出结论：
pageX > clientX, pageY > clientY
pageX = clientX + ScrollLeft(滚动条滚过的水平距离)
pageY = clientY + ScrollTop(滚动条滚过的垂直距离)

# contenteditable
HTML 全局属性contenteditable  是一个枚举属性，表示元素是否可被用户编辑。 如果可以，浏览器会修改元素的部件以允许编辑。
<label contenteditable="true">Example Label</label>

# 获取光标所在的位置
const selection = window.getSelection() ; //返回一个Selection对象,对象里面有一些属性可以用来取到光标所在的元素或者光标所在位置或者覆盖的文字
* selection对象
Selection对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。文本选区由用户拖拽鼠标经过文字而产生。要获取用于检查或修改的Selection对象，请调用 window.getSelection()。
* range对象
文档中用户选择的区域(拖蓝). 获取当前选中的范围 let range = selection.getRangeAt(0)
属性: selection.rangeCount 返回当前选中区域的数量
方法: selection.getRangeAt(0), 返回选区开始的节点.
selection.delectionFromDocument(), 从页面中删除选区中的内容.

# event.preventDefault()
event.preventDefault().阻止事件的默认行为.

# 编码
有些符号在URL中是不能直接传递的，如果要在URL中传递这些特殊符号，那么就要使用他们的编码了。
编码的格式为：%加字符的ASCII码，即一个百分号%，后面跟对应字符的ASCII（16进制）码值。例如 空格的编码值是"%20"。
如果不使用转义字符，这些编码就会当URL中定义的特殊字符处理。
下表中列出了一些URL特殊符号及编码 十六进制值
1) + URL 中+号表示空格 %2B
2) 空格 URL中的空格可以用+号或者编码 %20
3) / 分隔目录和子目录 %2F
4) ? 分隔实际的 URL 和参数 %3F
5) % 指定特殊字符 %25
6) # 表示书签 %23
7) &amp; URL 中指定的参数间的分隔符 %26
8) = URL 中指定参数的值 %3D

# Vue scoped css
在style标签中使用 scoped以实现css模块化,原理是给标签打上 tag.
问题有时候会因为标签打上了,而找不到标签,导致设置class没有作用,因此使用scoped要仔细考虑.
(通过PostCSS来实现这种转换)
https://vue-loader.vuejs.org/en/features/scoped-css.html3 vue-loader的官方文档中也说了这个问题 所以使用 >>> 符号可以做到，但是注意vue-loader的版本要高于12.2.0 这个功能是这个版本后才具有的.
scoped三条渲染规则：
　　1、给HTML的DOM节点加一个不重复data属性(形如：data-v-19fca230)来表示他的唯一性
　　2、在每句css选择器的末尾（编译后的生成的css语句）加一个当前组件的data属性选择器（如[data-v-19fca230]）来私有化样式
　　3、如果组件内部包含有其他组件，只会给其他组件的最外层标签加上当前组件的data属性

# npm全局安装包的位置
使用npm root -g 进行查询
# npm 更新版本到最新
npm install npm@latest -g
# node
输入命令sudo npm install n -g，来安装n这个工具，n可以切换node版本
输入命令sudo n stable，安装最新稳定版的nodejs
重启终端，查看node.js和npm版本,node --version,npm  --version

# Vue: $forceUpdate()
对象深层的数据改变,Vue无法监听,用于强制更新数据
# Vue: $refs
$refs在template和computed属性中使用无效,它不是响应式的.
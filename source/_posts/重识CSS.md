---
title: 重识CSS
date: 2020-10-09 18:15:25
tags: CSS
---

# 重识 CSS

CSS 层叠样式表，见文知义，CSS 特点层叠，最终的样式是由多个属性组合一起决定的。

## CSS 经验

### zoom 和 transform 控制元素缩放

#### transform 属性

### 文字和数字一起竖向排列

```css
p {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```

### 关于 height

元素的 height 未设置的时候是由内容撑开的。
子元素的 height 设置为父元素的高度的一定比例时，是按父元素的 content-box 的高度去计算的。

### display，position，float

### BFC(Block Format Context)

块级格式化上下文

### margin 合并

### 关于 width

div 的 width 未设置的时候是占满容器宽度的。
外层元素的 width 不要设置。设置元素的 border，padding 都是占用的 content 的宽高。

### 使用 flex 布局

父元素设置为 flex，内部子元素会成为 flex-item，flex-item 会具有伸缩的性质，会自然的去占据容器，拥有容器的宽或高。横向排列时，子元素自然拥有父元素的高，纵向排列时，子元素自然拥有父元素的宽。
成为 flex-item 的子元素，不再区分行内元素和块元素的特性，即 div 不再占据容器的宽，span 也可以设置宽高。
因此想让子元素按纵轴排列时设置 flex-direction 为 column 时，父元素一定要给高度。

### flex:1;

flex:1 就是等于 flex: 1 1 0%。
flex 默认为 0 1 auto。
flex: auto 就是等于 flex:1 1 auto。
flex: none 就是等于 flex：0 0 auto。
flex-grow，flex-shrink，flex-basis 是 flex 布局下内部子元素的属性。
flex-grow 如果存在剩余空间，设置项目放大的比例，默认为 0，即为不放大。
flex-shrink 如果空间不足，设置项目缩小的比例，默认为 1，设置为 0 时则不缩小。
flex-basis 在分配多余空间之前，设置项目占据的主轴空间（main size），默认为 auto，即项目的本来大小。

### 布局套路

外层使用给定宽度的 div 包裹，内部元素的宽度可以使用百分比，或继承 inherit 外层元素的宽度。

### 宽度分离（无 width 原则）

父级元素设置 width，子级元素不设置 width，仅改变 padding，border， 来使得 CSS 自己计算 width，子元素 div 直接继承父元素的宽度。

### inline-block

inline-block 存在的小问题：
设置 display:inline-block 后，存在间隙问题，间隙为 4 像素，这个问题产生的原因是换行引起的，因为我们写标签时通常会在标签结束符后顺手打个回车，而回车会产生回车符，回车符相当于空白符，通常情况下，多个连续的空白符会合并成一个空白符，而产生“空白间隙”的真正原因就是这个让我们并不怎么注意的空白符。
去除空隙的方法：
对父元素添加，{font-size:0}，即将字体大小设为 0，那么那个空白符也变成 0px，从而消除空隙。

### 块级元素和内联元素

块级元素：div， hr，ul，li，p，没有标签包裹的文本会形成块。 块级元素会自适应容器宽度，自己配置 padding，border，margin。
内联元素：a， span，strong 等。
块级元素可以设置宽高，内联元素不能设置宽高，将内联元素 display 设置为 inline-block，才可以设置宽高。
display 属性改变元素的呈现形式，要给内联元素设置宽高，需要将其变为 inline-block。
display 属性：block，inline-block，inline-table，none。

### 定位 position

子绝父相
relative 相对自身在文档流中的位置定位。
absolute 相对父级元素的位置定位，脱离文档流，形成新的块。

### Div + CSS

做 Div+ CSS 布局的时候，应该先对照 UI 设计图，进行布局，先分析结构，将 UI 设计图分解成块。
在写代码时，始终要注意用容器包裹，使用父级的 width。

需要设置 display: inline-block 的两种情况：

1. 多个块级元素需要放在同一行时。
2. 内联元素需要设置 width 和 height 的时候。
   设置该属性之后，可以设置 width，不设置则 width 为内容的宽度，并不会填充父容器。

### transparent

transparent 是全透明黑色(black)的速记法，即一个类似 rgba(0,0,0,0)这样的值。

### span

span 里面不能包含 div，div 可以包含 span

### CSS 使用 BEM 规范命名

BEM 是 Block Element Modifier 的缩写，它将一个类名分成这三个部分：模块、模块元素、描述符。模块规定整个组件的样式；模块元素规定这个组件中子元素的样式；描述符描述一种特殊的种类，给模块或模块元素增加特别的样式，以表示这个元素处于某种特别的状态（比如说被选中的状态）。

使用\_\_连接模块与模块元素，使用--来连接描述符，如果一个名字由多个单词组成，用单词分隔符-来分割。

```css
// Block (Highest level)
.block {
  ...;
}

// Element (Descendent of block)
.block__element {
  ...;
}

// Modifier (Different state or version)
.block--modifier {
  ...;
}
.block__element--modifier {
  ...;
}
```

## CSS 实现

### div 实现直线 虚线

```html
<div style="width:480px;height:1px; background:black;"></div>
<div style="width:1000px;height:5px;border-top:1px dotted black;"></div>
<!-- hr 实现直线 -->
<hr
  style="display: inline-block;border:none;border-top:1px solid #000;width: 80%;"
/>
```

### CSS 实现三角形

css 实现三角形
伪元素实现三角符，无法被 js 获取。

### fieldset 标签

实现方框上有文字显示

### element UI

1. 在 element UI 中，先布局用容器 el-row，el-col 包裹各种组件。
2. el-col 内可以包裹 el-row 来进行再次分块布局。
3. 要调整 element 内部组件的样式，尽量使用 div 包裹组件，在 div 上使用 class。
4. 不在标签上使用 style，将样式写在 class 内。
5. el-col 通过 span 设置宽度，高度由内容撑开。
6. 多个 el-button，只有第一个没有 margin-left：10px;其余的都有 margin-left.去掉 margin-left 包裹一层 div 即可。

### 使用 CSS 实现刻度尺

1. 使用 CSS 函数 repeating-linear-gradient()返回重复线性渐变组成的图片，只能用于 image。
2. background-position 为每一个背景图片设置初始位置。 这个位置是相对于由 background-origin 定义的位置图层的。相对于 x 轴 y 轴设置偏移量。
3. background-image 设置元素的背景图片，可以设置多张图片，有覆盖效果。
4. background-size 设置背景图片宽高。

```css
#ruler {
  width: calc(16cm + 5px);
  height: 2cm;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #000;
  position: relative;
  margin-left: calc(2cm + 5px);

  background-image: repeating-linear-gradient(
      to right,
      #000 0 5px,
      transparent 0 1cm
    ),
    /** 1cm的刻度*/ repeating-linear-gradient(to right, #000 0 2px, transparent
          0 0.5cm), /** 0.5cm的刻度 */ repeating-linear-gradient(to right, #000
          0 1px, transparent 0 0.1cm); /** 0.1cm的刻度 */
  background-position: 0.5cm 0, calc(0.5cm + 1.5px) 0, calc(0.5cm + 2px) 0; /** 设置图片的位置 将刻度移动到中心*/
  background-size: 100% 30px, calc(100% - 1cm) 20px, calc(100% - 1.2cm) 10px; /** 设置图片的宽高 设置宽度将多余的裁剪掉 高度为刻度的高度 */
  background-repeat: no-repeat;
  span {
    flex: 1;
    margin-top: 25px;
    text-align: center;
  }
}
```

### CSS calc() 函数

CSS calc() 函数动态计算长度值。运算符号中间使用空格隔开。

### CSS 实现三角形的原理

### CSS 实现斜线

```css
/* 使用transform实现 ，绝对定位，top， left移动位置，border画线  */
span {
  position: abcolute;
  width: 0;
  height: 100px;
  border-left: 1px solid #000;
  transform: rotate(-45deg);
  top: 10px;
  left: 10px;
}
```

### table 的特点

tr 行 td 单元格，
单元格的高度由内容决定。

## 布局

1. 常见的 Div 盒模型 + Css 布局。
2. table 可以用来布局。
3. flex 布局。

### 响应式布局（自适应）

Responsive Web Design, 指可以自动识别屏幕宽度并作出相应调整的网页设计。简单来说就是宽度不能固定。
可以从以下几个方面做响应式布局。

#### viewport

viewport 是网页的默认宽高，width=device-width 指网页宽度默认等于屏幕宽度，initial-scale=1 指原始缩放比例为 1.0,即网页初始大小占屏幕的 100%。

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
```

#### 不使用绝对宽度

css 代码不能指定像素宽度，因为，宽度固定后，在设备宽度不同的情况下，影响其他元素的宽度，从而显示不一样，可能造成混乱。尽量使用百分比宽度。

#### 使用 min-width 和 max-width

min-width：设置最小宽度，当宽度小于设置的宽度时，使用设置的宽度。
max-width：设置最大宽度，当宽度大于设置的宽度时，使用设置的宽度。

#### 使用 em 和 rem

em 基于父元素的 font-size。
rem 基于根元素的 font-size，一般为 16px。

#### 使用媒体查询@media

```css
/* 屏幕宽度小于400px时 应用样式 */

@media screen and (max-device-width；400px) {
  .className {
    ...;
  }
}
```

## js 实现

### js 实现拖拽效果

```html
<body>
  <div di="diagram"></div>
</body>
<script>
  window.onload = function () {
    var target = document.getElementById('diagram');
    this.startDrag(target);
  }
  var params = {
    left: 0,
    top: 0,
    currentX: 0,
    currentY: 0,
    flag: false
  };
  getCss(target, key) {
    return target.currentStyle
      ? target.currentStyle[key]
      : document.defaultView.getComputedStyle(target, false)[key];
  };
  startDrag(target, callback) {
    let that = this;
    if (this.getCss(target, 'left') !== 'auto') {
      this.params.left = this.getCss(target, 'left');
    }

    if (this.getCss(target, 'top') !== 'auto') {
      this.params.top = this.getCss(target, 'top');
    }

    target.onmousedown = function (e) {
      console.log('1111');
      that.params.flag = true;
      if (!e) {
        e = window.event;
        target.onselectstart = function () {
          return false;
        };
      }
      that.params.currentX = e.clientX;
      that.params.currentY = e.clientY;
    };
    document.onmouseup = function () {
      console.log('333');
      that.params.flag = false;
      if (that.getCss(target, 'left') !== 'auto') {
        that.params.left = that.getCss(target, 'left');
      }
      if (that.getCss(target, 'top') !== 'auto') {
        that.params.top = that.getCss(target, 'top');
      }
    };
    document.onmousemove = function (event) {
      var e = event ? event : window.event;
      if (that.params.flag) {
        var nowX = e.clientX,
          nowY = e.clientY;
        var disX = nowX - that.params.currentX,
          disY = nowY - that.params.currentY;
        target.style.left = parseInt(that.params.left) + disX + 'px';
        target.style.top = parseInt(that.params.top) + disY + 'px';
        console.log('move', target.style.left);
        if (typeof callback == 'function') {
          callback(
            (parseInt(that.params.left) || 0) + disX,
            (parseInt(that.params.top) || 0) + disY
          );
        }

        if (event.preventDefault) {
          event.preventDefault();
        }
        return false;
      }
    };
  }
</script>
```

### js 实现滑动效果

### js 实现子元素滚动到底，不影响父元素的滚动。

event.preventDefault()

# 阻止冒泡行为

js 冒泡和捕获是事件的两种行为，使用 event.stopPropagation()起到阻止捕获和冒泡阶段中当前事件的进一步传播。

```js
function stopBubble(e) {
  //如果提供了事件对象，则这是一个非IE浏览器
  if (e && e.stopPropagation)
    //因此它支持W3C的stopPropagation()方法
    e.stopPropagation();
  //否则，我们需要使用IE的方式来取消事件冒泡
  else window.event.cancelBubble = true;
}
```

# 阻止默认行为

preventDefault 它是事件对象(Event)的一个方法，作用是取消一个目标元素的默认行为。

```js
//阻止浏览器的默认行为
function stopDefault(e) {
  //阻止默认浏览器动作(W3C)
  if (e && e.preventDefault) e.preventDefault();
  //IE中阻止函数器默认动作的方式
  else window.event.returnValue = false;
  return false;
}
```

# setTimeout 和 setInterval 总结

setInterval 本身不会引起内存泄漏，而在于怎么使用。
如果 setInterval 中存在无法回收的内容，那么这一部分内存就永远无法释放，这样就导致内存泄漏。

## 合理使用变量

变量的提升（函数内使用 var 声明的变量，在函数外部还能访问）并且没有清除函数外部变量引用的情况下会导致内存无法释放。

```js
// 函数运行完之后，内部的内存会自动释放，无需重置，然而全局变量却一直存在。
let array = [];
function createArray() {
  for (let j = 0; j < 100000; j++) {
    array.push(j * 3 * 5);
  }
}
setInterval(createArray, 1000);
// 函数运行完，内部的变量会被释放。不会因定时器导致内存增加
function createArray() {
  let array = [];
  for (let j = 0; j < 100000; j++) {
    array.push(j * 3 * 5);
  }
}
setInterval(createArray, 1000);
```

## 游离的 DOM

游离状的 dom 无法被回收。

```js
// 虽然root元素在dom中被删除了，但是引用还在，这个时候root的子元素就会以游离状态的dom存在，而且无法被回收。解决方案就是root=null，清空引用，消除游离状态的dom。
let root = document.getElementById("root");
for (let i = 0; i < 2000; i++) {
  let div = document.createElement("div");
  root.appendChild(div);
}
document.body.removeChild(root);
```

# requestIdleCallback 和 requestAnimationFrame

requestAnimationFrame 每一帧必定会执行，requestIdleCallback 是在浏览器空闲时间来执行任务。

# vue watch 执行两次

不要忽略 初始值 和 获取的异步数据不相同的时候，也会触发一次 watch。
设置 watch 的 immediate 属性位 true 可以让，watch 的 handler 函数先执行， 而不用在生命周期函数 created 里面去执行。

# vue watch 导致死循环

在 watch 里面监听 data 的数据，然后又在 handler 函数里修改监听的数据的属性，可能会导致死循环。

# 大数据渲染问题

## 一次渲染完所有的数据

一次渲染完所有的数据，会导致浏览器卡顿。

## 使用定时器 setTimeout 分批渲染

出现闪屏的问题，原因如下

1. setTimeout 的执行时间并不是确定的。在 JS 中，setTimeout 任务被放进事件队列中，只有主线程执行完才会去检查事件队列中的任务是否需要执行，因此 setTimeout 的实际执行时间可能会比其设定的时间晚一些，setTimeout 函数的第二个参数不是等多长时间之后执行，而是等多长时间后将其放入执行队列。
2. 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的刷新频率可能会不同，而 setTimeout 只能设置一个固定时间间隔，这个时间不一定和屏幕的刷新时间相同。

以上两种情况都会导致 setTimeout 的执行步调和屏幕的刷新步调不一致。在 setTimeout 中对 dom 进行操作，必须要等到屏幕下次绘制时才能更新到屏幕上，如果两者步调不一致，就可能导致中间某一帧的操作被跨越过去，而直接更新下一帧的元素，从而导致丢帧现象。 3. 使用 requestAnimationFrame 分批渲染
requestAnimationFrame 最大的优势是由系统来决定回调函数的执行时机。requestAnimationFrame 的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象。 4. 使用 DocumentFragment
DocumentFragment 不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的(重新渲染) ，且不会导致性能等问题。可以使用 document.createDocumentFragment 方法或者构造函数来创建一个空的 DocumentFragment。

DocumentFragments 是 DOM 节点，但并不是 DOM 树的一部分，可以认为是存在内存中的，所以将子元素插入到文档片段时不会引起页面回流。

当 append 元素到 document 中时，被 append 进去的元素的样式表的计算是同步发生的，此时调用 getComputedStyle 可以得到样式的计算值。

而 append 元素到 documentFragment 中时，是不会计算元素的样式表，所以 documentFragment 性能更优。当然现在浏览器的优化已经做的很好了，当 append 元素到 document 中后，没有访问 getComputedStyle 之类的方法时，现代浏览器也可以把样式表的计算推迟到脚本执行之后。

documentFragment 是一个保存多个 element 的容器对象（保存在内存）当更新其中的一个或者多个 element 时，页面不会更新。只有当 documentFragment 容器中保存的所有 element 更新后再将其插入到页面中才能更新页面。

# 全屏显示 api

全屏显示 js 库 screenfull

```js
// 全屏显示的函数
fullScreen() {
  if (!document.fullscreenElement) {
    document.getElementById('container').requestFullscreen();
  }
}
// Esc 键按下 退出全屏
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 27) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
})
```

# event bus

A 组件想 改变 B 组件内的状态，B 组件注册一个监听器($eventBus.on('ClickEvent', onClickFunc))，然后去执行回调函数，回调函数内去改变当前组件的状态。A组件触发事件($eventBus.emit('ClickEvent', params))。

# vue click native 事件修饰符

在原生 DOM 元素上使用绑定 click 事件不能使用 native 修饰符，否则会报错。在组件上绑定 click 事件需要使用 native 修饰符，否则将不会起作用。

# vue 绑定事件的处理函数

vue 绑定的事件的事件处理函数要传参数，第一个为$event, 后面为要传入函数的参数。

```js
 @showBridgeTable="showBridgeTable($event, param1)"
```

# js 监听浏览器各个标签页的切换

当用户最小化网页或移动到另一个标签时，API 会发送 visibilitychange 有关该网页的可见性的事件。页面可见状态的改变可以通过监听 visibilitychange 事件来获取。应用场景，标签页隐藏时，最小化时，清除页面内的定时器，暂停轮询服务器，暂停轮播等动画效果。

注意在单页面应用 web 程序中的所有路由占用的是同一个标签页。因此在某一个路由下的页面组件中注册的监听事件，会在全局有效。即在其他路由的页面下，切换标签页，也会触发监听事件，可能会导致回调函数里面的代码重复调用。因此需要配合$route.path 一起使用，验证当前的路由正确时，才执行回调函数。

```js
document.addEventListener("visibilitychange", function () {
  // 网页对用户不可见时
  if (document.visibilityState === "hidden") {
    return;
  }
  // 网页对用户可见时
  if (document.visibilityState === "visible") {
    return;
  }
  // 网页被预渲染并且用户不可见时
  if (document.visibilityState === "prerender ") {
    return;
  }
  // 文档被卸载时
  if (document.visibilityState === "unloaded ") {
    return;
  }
});
```

# 使用 setTimeout 实现 setInterval

```js
function reCall() {
  if (condition) {
    return;
  }

  /*
    这部分放要执行的代码块
  */
  const timeout = setTimeout(function () {
    reCall();
    clearSetimeout(timeout);
  }, 1000);
}
reCall();
```

# Css 文字超出显示省略号

单行文本超出显示省略号

```css
.text-block-hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

多行文本超出显示省略号

```css
p {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /*控制在3行*/
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  background-color: #ffe51a;
}
```

# dialog 问题

没有使用 v-if，dialog 弹窗没有重置表单验证器，导致弹窗再次打开时，表单验证器还是会校验上一次（关闭弹窗前）的值。

# 对于复杂的表单数据

对于复杂的表单数据，常维护两个数据结构，一个 formData 用来界面显示，并且与用户交互；一个 submitData 用于提交，这个数据基于 formData 拷贝，在提交之前还要进行一些修改，但是我们不希望数据的更改会反应在 formData 上时，就通过拷贝 formData 数据，再在新的数据上操作，得到 submitData 用于发送请求。

# Vuex storage 的问题

computed 中可以使用 vuex storage 中的数据，但是注意 数据是否存在的问题，组件加载先还是数据先获取到。
对于父组件发送请求 将请求到的数据保存到 Vuex storage 中， 此时子组件挂载时使用了通过 computed 间接使用了 storage 中的 state 去获取某个数据对象的属性，由于子组件挂载的速度比请求数据的速度快，导致子组件获取 state 的数据对象的属性此时还并没有该属性，而导致 undefined 的错误。

```js
// 出问题的写法
getCurrentBridgeColor() {
  const currentBridge = this.$store.state.cwp.workData.m_ListQuayCranes.find(
    item => item.CraneNo === this.bridgeWorkData.CraneNo
  ) : {CraneColor: '#fff'};

  return currentBridge.CraneColor;
},
// 解决办法 先给出一个默认对象，由于computed是响应式的，值改变之后会触发更新，当数据请求完之后，vuex storage中就会有值了。
getCurrentBridgeColor() {
  const currentBridge = this.$store.state.cwp.workData.m_ListQuayCranes ? this.$store.state.cwp.workData.m_ListQuayCranes.find(
    item => item.CraneNo === this.bridgeWorkData.CraneNo
  ) : {CraneColor: '#fff'};

  return currentBridge.CraneColor;
},
```

总结 ： 由于异步数据导致 组件加载完成了，数据才有的情况，我们可以有两种方式去处理，1.通过 computed 数据没有的时候给一个默认值。 2.通过 v-if="renderData"控制,当数据有了之后再去加载组件。

# 关于 事件监听模式 event on event emit

通过事件监听 可以进行组件之间的值传递， B 组件向 A 组件传值，A 注册监听事件和监听事件触发的回调函数；B 组件触发事件，将数据作为参数传递过去。

# vue 中处理数据绑定到页面中的问题

无论是在 computed 和 methods 中获取异步数据，再通过方法处理绑定到页面数据上时，可能存在数据还没有拿到的情况，在取其中的属性做判断是，需要先验证属性是否存在，没有则给一个默认值，以防止出现死循环和属性不存在等问题。

# JS 实现框选功能

实现框选功能主要和 mousedown,mousemove,mouseUp 这三个事件有关系。

```js
// 阻止事件冒泡和默认行为
clearEventBubble(e) {
  // 阻止事件冒泡
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true; // 兼容IE浏览器
  }
  // 阻止默认行为
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false; // 兼容IE浏览器
  }
},
// 鼠标左键按下事件处理函数
mouseDown(e) {
  // 阻止事件冒泡
  this.clearEventBubble(e);
  // 判断是否为鼠标左键按下
  if (e.buttons !== 1) {
    return;
  }
  this.mouseOn = true;
  // 获取容器元素
  const selectContainer = this.$refs.selectContainer;
  const { top, left } = selectContainer.getBoundingClientRect();
  this.coverStartX = e.clientX - left;
  this.coverStartY = e.clientY - top;
},
// 鼠标移动事件处理函数
mouseMove(e) {
  // 阻止事件冒泡
  this.clearEventBubble(e);
  // 不是框选退出
  if (this.mouseOn === false) {
    return;
  }
  // 获取容器元素
  const selectContainer = this.$refs.selectContainer;
  const { left, top } = selectContainer.getBoundingClientRect();
  const _x = e.clientX - left;
  const _y = e.clientY - top;
  const _H = selectContainer.clientHeight;
  // 限定鼠标操作的范围，超出容器做相应处理
  // 向下拖拽
  if (_y >= _H && selectContainer.scrollTop <= _H) {
    selectContainer.scrollTop += _y - _H;
  }
  // 向上拖拽
  if (e.clientY <= top && selectContainer.scrollTop > 0) {
    selectContainer.scrollTop = Math.abs(e.clientY - top);
  }
  // 根据坐标给选框修改样式
  const selectElement = this.$refs.selectElement;
  selectElement.style.display = 'block';
  selectElement.style.left = Math.min(_x, this.coverStartX) + 'px';
  selectElement.style.top = Math.min(_y, this.coverStartY) + 'px';
  selectElement.style.width = Math.abs(_x - this.coverStartX) + 'px';
  selectElement.style.height = Math.abs(_y - this.coverStartY) + 'px';
},
// 鼠标松开事件处理函数
mouseUp(e) {
  // 阻止事件冒泡
  this.clearEventBubble(e);
  if (this.mouseOn === false) {
    return;
  }
  // 处理鼠标点击松开 统计被选中元素
  const selectElement = this.$refs.selectElement;
  const drawBlockElements = document.getElementsByClassName('draw-block');

  const left = selectElement.offsetLeft;
  const top = selectElement.offsetTop;
  const width = selectElement.offsetWidth;
  const height = selectElement.offsetHeight;
  const currentSelectedElements = [];
  // 判断元素是否选中
  for (let i = 0; i < drawBlockElements.length; i++) {
    const currentElementLeft =
      drawBlockElements[i].offsetWidth + drawBlockElements[i].offsetLeft;
    const currentElementTop =
      drawBlockElements[i].offsetHeight + drawBlockElements[i].offsetTop;
    // 满足条件则选中
    if (
      currentElementLeft > left &&
      currentElementTop > top &&
      drawBlockElements[i].offsetLeft < left + width &&
      drawBlockElements[i].offsetTop < top + height
    ) {
      currentSelectedElements.push(drawBlockElements[i]);
    }
  }
  // 处理当前选中的元素，改变数据的属性值
  this.handleSelectedElement(currentSelectedElements);
  // 隐藏选框元素
  this.resetSelectedCover();
  // 选框事件结束
  this.mouseOn = false;
},
```

# JS 中 find 方法

find 方法 获取数组的对象，会取得数组中对象的引用。

# JS 中 concat 方法

concat 不会改变原数组，会返回一个新的数组

# JS 中 sort 方法

sort 方法会改变原数组

# JS 中 forEach 方法

forEach 方法没有返回值，因此不要进行以下的链式调用，以防出错

```js
// b ---> undefined
let a = [{ key: "1" }, { key: "2" }];
let b = a.slice().forEach((item) => (item.key = 2));
```

# JS 中对象数组的赋值

注意 JS 中对象和数组的赋值，是传递的引用，变量改变会间接影响原始数据。

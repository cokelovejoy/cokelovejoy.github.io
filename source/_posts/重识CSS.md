# 重识 CSS

CSS 层叠样式表，见文知义，CSS 特点层叠，最终的样式是由多个属性组合一起决定的。

## CSS 经验
### 文字和数字一起竖向排列
```css
p {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```
### 关于height
元素的height未设置的时候是由内容撑开的。
子元素的height设置为父元素的高度的一定比例时，是按父元素的content-box的高度去计算的。
### display，position，float
### BFC(Block Format Context)
块级格式化上下文
### margin合并
### 关于width
div的width未设置的时候是占满容器宽度的。
外层元素的width不要设置。设置元素的border，padding都是占用的content的宽高。
### 使用flex布局
父元素设置为flex，内部子元素会成为flex-item，flex-item 会具有伸缩的性质，会自然的去占据容器，拥有容器的宽或高。横向排列时，子元素自然拥有父元素的高，纵向排列时，子元素自然拥有父元素的宽。
成为flex-item的子元素，不再区分行内元素和块元素的特性，即div 不再占据容器的宽，span也可以设置宽高。
因此想让子元素按纵轴排列时设置flex-direction为column时，父元素一定要给高度。

### flex:1;
flex:1就是等于 flex: 1 1 0%。
flex 默认为 0 1 auto。
flex: auto 就是等于 flex:1 1 auto。
flex: none 就是等于 flex：0 0 auto。
flex-grow，flex-shrink，flex-basis是 flex布局下内部子元素的属性。
flex-grow 如果存在剩余空间，设置项目放大的比例，默认为0，即为不放大。
flex-shrink 如果空间不足，设置项目缩小的比例，默认为1，设置为0时则不缩小。
flex-basis 在分配多余空间之前，设置项目占据的主轴空间（main size），默认为 auto，即项目的本来大小。
### 布局套路

外层使用给定宽度的 div 包裹，内部元素的宽度可以使用百分比，或继承 inherit 外层元素的宽度。

### 宽度分离（无 width 原则）

父级元素设置 width，子级元素不设置 width，仅改变 padding，border， 来使得CSS自己计算width，子元素div直接继承父元素的宽度。

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
6. 多个el-button，只有第一个没有margin-left：10px;其余的都有margin-left.去掉margin-left 包裹一层div即可。 

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

### 实现拖拽效果

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
  },
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
}
</script>
```

### 实现滑动效果

### CSS 实现三角形的原理

### table 的特点

tr 行 td 单元格，
单元格的高度由内容决定。

## 布局
1. 常见的Div盒模型 + Css布局。
2. table可以用来布局。
2. flex布局。
### 响应式布局（自适应）
Responsive Web Design, 指可以自动识别屏幕宽度并作出相应调整的网页设计。简单来说就是宽度不能固定。
可以从以下几个方面做响应式布局。
#### viewport
viewport是网页的默认宽高，width=device-width指网页宽度默认等于屏幕宽度，initial-scale=1指原始缩放比例为1.0,即网页初始大小占屏幕的100%。
```html
<meta name="viewport" content="width=device-width,initial-scale=1"/>
```
#### 不使用绝对宽度
css代码不能指定像素宽度，因为，宽度固定后，在设备宽度不同的情况下，影响其他元素的宽度，从而显示不一样，可能造成混乱。尽量使用百分比宽度。
#### 使用min-width和max-width
min-width：设置最小宽度，当宽度小于设置的宽度时，使用设置的宽度。
max-width：设置最大宽度，当宽度大于设置的宽度时，使用设置的宽度。
#### 使用em 和 rem
em基于父元素的font-size。
rem基于根元素的font-size，一般为16px。
#### 使用媒体查询@media

```css
/* 屏幕宽度小于400px时 应用样式 */

@media screen and (max-device-width；400px) {
  .className {
    ...
  }
}
```
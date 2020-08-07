---
title: Web API
date: 2020-08-07 15:39:30
tags:
---
# Blob
Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。
## 创建Blob实例
```js
const blob = new Blob(array, options)
// example
var aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // 一个包含DOMString的数组
var oMyBlob = new Blob(aFileParts, {type : 'text/html'}); // 得到 blob， type它代表了将会被放入到blob中的数组内容的MIME类型
```
## 属性
```js
blob.size // blob对象中所包含数据的大小(字节)
blob.type // 一个字符串，表明该 blob对象中所包含数据的大小 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。
```
## 方法
```js
blob.slice(start, end) // 返回一个新的 Blob 对象，它包含了原始 Blob 对象的某一个段的数据。
blob.stream() // 返回一个ReadableStream对象，读取它将返回包含在Blob中的数据。
blob.text()    // 返回一个 Promise 对象，包含 blob 中的内容，使用 UTF-8 格式编码。
blob.arrayBuffer() // 返回一个promise且包含blob所有内容的二进制格式的 ArrayBuffer 
```
# File
通常情况下， File 对象是来自用户在一个 input 元素上选择文件后返回的 FileList 对象。
File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
## 创建File实例
```js
const myFile = new File(bits, name, options)
```
## 属性
File 接口也继承了 Blob 接口的属性
```js
file.lastModified // 只读属性 ，返回所引用文件最后修改日期，为自1970年1月1日0:00 以来的毫秒数。没有已知的最后修改时间则会返回当前时间。
file.name // 返回当前 File 对象所引用文件的名字。
file.size // 返回文件大小。
file.type // 返回文件的类型。
```
## 方法
File 接口没有定义任何方法，但是它从 Blob 接口继承了以下方法：
```js
file.slice() // 返回一个新的 Blob 对象，它包含有源 Blob 对象中指定范围内的数据。
```
# FileReader
FileReader构造函数创建的实例允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，通常处理 File 或 Blob 对象。
## 创建FileReader 实例
```js
const reader = new FileReader()
```
## 属性
```js
reader.result // 只读属性，文件的内容，只有在读取操作完成后才有效。
reader.error  // 只读属性，表示在读取文件时发生的错误。
reader.readyState // 只读属性，表示reader的状态，0 还没有加载数据，1 数据正在被加载， 2 已经完成全部的读取请求
```
## 事件
```js
reader.onabort = function () {...} // 处理abort事件。该事件在读取被中断时触发。
reader.onerror = function () {...} // 处理error事件。该事件在读取发生错误时触发。
reader.onload = function () {...} // 处理load事件。该事件在读取完成时触发。
reader.onloadstart = function () {...} // 处理loadstart事件。该事件在读取开始时触发。
reader.onloadend = function () {...} // 处理loadend事件。该事件在读取结束时触发。
reader.onprogress = function () {...} // 处理progress事件。该事件在读取Blob时触发。
```
## 方法
```js
reader.abort() // 终止读取操作。 readyState为已完成。
reader.readAsArrayBuffer() // 读取指定的Blob中的内容，完成后result属性中保存的文件的ArrayBuffer数据对象。
reader.readAsDataURL() //  读取指定的Blob中的内容，完成之后result属性中将包含一个data：URL格式的Base64字符串表示读取文件的内容。
reader.readAsText() // 读取指定的Blob中的内容，完成之后result属性中包含一个字符串以表示所读取的文件内容。
```
# ArrayBuffer对象
ArrayBuffer 对象表示一段二进制数据，用来模拟内存里面的数据。通过这个对象，JavaScript 可以读写二进制数据。这个对象可以看作内存数据的表达。
## 创建实例
```js
var buffer = new ArrayBuffer(8); // 占8个字节的二进制数据。
```
## 属性
```js
buffer.byteLength // 表示当前实例占用的内存长度（单位字节）
```

## 方法
```js
const subBuffer = buffer.slice(start, end)
```
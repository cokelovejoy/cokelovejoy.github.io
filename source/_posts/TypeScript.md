---
title: TypeScript
date: 2020-07-22 09:38:40
tags:
---

# TypeScript
TypeScript是JavaScript的超集，它可编译为纯JavaScript，是一种给JavaScript添加特性的语言扩展。

TS有如下特点：
* 类型注解和编译时类型检查
* 基于类的面向对象编程
* 泛型
* 接口
* 声明文件

# 创建基于TS的Vue项目
```bash
# 在已经存在项目中安装ts，破坏性的
vue add @vue/typescript
```
# 类型注解和编译时类型检查
类型注解：变量后面通过冒号+类型来做类型注解
```js
// 常用的类型：string, number, boolean, void, any, object, null, undefined
// 类型注解
let  title: string;
title = '1'; // right
title = 1; // error
// 类型推论
let name = 'richard'
name = 1; // error
// 数组类型
let nameList: string[];
nameList = ["tom"]; // Array<string>
// 任意类型
let foo: any;
foo = "xx";
foo = 1;
// any类型也可以用于数组
let list: any[];
list = [1, true, 'xx']
// 函数中的类型，参数有类型，返回值有类型
function greet(person: string): string {
    return 'hello ' + person;
}
// 类作为类型
class Feature {
    // constructor函数 中声明的参数会被作为成员属性
    constructor(public id: number, public name: string) {}
}
let features: Feature[] = [{id:1, name: 'haha'}, {id:2, name: 'hehe'}]
```
# 函数
## 必填参数
参数一旦声明，就要求传递，且类型需要符合
```js
function greet(person: string): string {
    return 'hello ' + person;
}
greet('tom')
```
## 可选参数
参数名后面加上问号，变成可选参数
```js
function greet(person:string, msg?: string) :string {
    return 'hello' + person
}
```
## 参数默认值
```js
function greet(person:string, msg = 'haha') :string {
    return 'hello' + person
}
```
## 函数重载
同名函数，通过参数数量，参数类型的区别来返回不同类型的值。
```js
// 先声明，再实现
// 声明1
function info(a: {name: string}) :string;
// 声明2
function info(a: string) : {name: string};
// 实现
function info(a: {name:string} | string) : {name:string} | string {
    if (typeof a === 'object') {
        return a.name
    } else {
        return { name: a}
    }
}

console.log(info({name: 'tom'}));
console.log(info('tom'));
```
## 方法直接作为回调函数
```js
addFeature(event: KeyboardEvent)：void {
    // 类型断言
    const input = event.target as HTMLInputElement;
    this.feature.push(input.value);
    input.value = "";
}
```
# 类
```js
class MyComp {
    // 成员属性
    private _foo: string;  // 私有属性，仅类的内部使用，不能在类的外部访问。
    protected bar: string; // 保护属性，子类可以访问
    public zoo: string;    // 公共的，都可以访问
    // 构造函数参数有修饰符，能够定义为成员属性
    constructor(private tua = 'tua') {
        ...
    }
    // 存取器：属性方式访问，可以添加额外逻辑，控制读写性
    // vue中存取器可以用作计算属性
    get foo() {
        return this._foo;
    }
    set foo(val) {
        this._foo = val;
    }
    // 方法也有修饰符
    private someMethod() {}
}
// 继承
class SubComp extends MyComp {
    // 父类中的 protected 修饰的变量bar，只能在子类通过this.bar访问到，不能在子类的实例中访问到。
    constructor(a: string) {
        super(a); // 将继承类构造函数的参数传入到父类构造函数中。
    }
}
```

# 接口 - interface
接口仅约束结构，不要求实现，使用更简单。
```js
interface Feature {
    id: number;
    name: string;
}
// 函数参数为interface类型
function getFeature(feature: Feature) {
    return feature.id;
}
```
面向接口编程-类实现接口
```js
// 定义接口
interface Person {
    firstName: string;  // 要求必须有firstName属性
    lastName: string;   // 要求必须有lastName属性
    sayHello(): string; // 要求实现sayHello方法
}

// 类实现接口
class Greeter implements Person {
    constructor(public firstName = '', public lastName = '') {}
    sayHello() {
        return 'hello' + this.firstName + ' ' + this.lastName;
    }
}
// 创建对象实例
const user = new Greeter('richard', 'zhao')
console.log(user)

// 面向接口编程
function greeting(person: Person) {
    return person.sayHello();
}
console.log(greeting(user));
```
# 泛型
泛型(Generics)是指定义函数，接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。以此增加代码通用性。使用场景：有时候要求传入的参数类型和返回的结果类型一致，但传入的参数类型并不是确定的。类型变量T可以捕获用户传入的类型。
```js
//不使用泛型
interface Result {
    data: Feature[];
}
// 使用泛型
interface Result<T> {
    data: T;
}
// 泛型方法
function getData<T>(): Result<T> {
    const data: any = [{id:1,name:'richard'}, {id:2, name:'coke'}]
    return { data }
}
```
# 装饰器
装饰器用于扩展类或者它的属性和方法。@xx就是装饰器的写法。
## @Component-组件声明
典型应用是组件装饰器@Component,
```js
@Component({
    components: {
        HelloWorld
    }
})
export default class Hello extends Vue {}
// Component装饰器的实现内部就是调用了Vue.extend(options).
```
## @Prop-属性声明
除了在@Component中声明，还可以采用@Prop的方式声明组件属性。
```js
export default class Hello extends Vue {
    @Prop({type: String, required: true})
    private msg!: string; // !为明确赋值断言，意味着不需要检查
}
```
## @Emit-事件处理 @watch-监听
```js
// 派发事件
@Emit('addFeature') // 事件名称
private addFeature(event: any) {...}
// 监听
@Watch('msg')
onMsgChange() {..}
```
## vuex使用：vuex-class
vuex-class为vue-class-component提供Vuex状态绑定帮助方法。
### 安装依赖
```bash
npm i vuex-class -S
```
### 定义状态
```js
// store.ts

import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        features: [
            { id: 1, name: "类型", version: "1.0" },
            { id: 2, name: "编译型语言", version: "1.0" }
        ],
    },
    mutations: {
        addFeatureMutation(state: any, featureName) {
            state.features.push({ id: state.features.length + 1, name: featureName });
        }
    },
    actions: {
        addFeatureAction({ commit }, featureName) {
            commit("addFeatureMutation", featureName);    
        }  
    },   
})
```
### 使用
```js
import { State, Action, Mutation } from 'vuex-class';

@component
export default class Feature extends Vue {
    // 状态，动作，变更映射
    @State features!: string[];
    @Action addFeatureAction: any;
    @Mutation addFeatureMutation: any;

    private addFeature(event) {
        console.log(event);
        this.addFeatureAction(event.target.value);
        event.target.value = "";
    }
}
```
## 装饰器原理
装饰器其实就是函数，被装饰的部分会作为参数传入函数，它返回一个表达式，以供装饰器在运行时调用。使用@expression的形式。
### 类装饰器
类装饰器在类声明之前被声明（紧靠着类声明）。 类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。
类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。
```js
// target 是构造函数
function log(target: Function) {
    target.prototype.log = function() {
        console.log(this.bar)
    }
    // 如果类装饰器返回一个值，它会使用提供的构造函数来替代类的声明
}
@log
class Foo {
    bar = 'bar'
}
const foo = new Foo()
foo.log();
```
### 方法装饰器
方法装饰器声明在一个方法的声明之前（紧靠着方法声明）。 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。如果方法装饰器返回一个值，它会被用作方法的属性描述符。

方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数:
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的属性描述符。
```js
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value
    }
}
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "hello " + this.greeting;
    }
}
```
### 属性装饰器
属性装饰器声明在一个属性声明之前（紧靠着属性声明）。属性描述符不会做为参数传入属性装饰器。
属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
> 属性描述符不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。返回值也会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。
```js
function mua(target, name) {
    target[name] = 'mua...'
}
class Foo {
    @mua ns!: string;
}
console.log(foo.ns)

// 可以接受参数的写法，返回的是一个函数
function mua(param: string) {
    return function (target, name) {
        target[name] = param
    }
}
// @mua('xxx') ns!:string;
```
### 参数装饰器
参数装饰器声明在一个参数声明之前（紧靠着参数声明）。参数装饰器应用于类构造函数或方法声明。
参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 参数在函数参数列表中的索引。

>参数装饰器只能用来监视一个方法的参数是否被传入。

```js
class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet(@required name: string) {
        return "Hello " + name + ", " + this.greeting;
    }
}
```

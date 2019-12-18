---
title: Vue项目测试
date: 2019-12-18 14:49:02
tags:
---
# 项目测试
## 测试分类
常见的开发流程里,都有测试人员,他们不管内部实现机制,只看最外层的输入输出,这种我们称为黑
盒测试。比如你写一个加法的页面,会设计N个用例,测试加法的正确性,这种测试我们称之为E2E测
试。
还有一种测试叫做白盒测试,我们针对一些内部核心实现逻辑编写测试代码,称之为单元测试。
更负责一些的我们称之为集成测试,就是集合多个测试过的单元一起测试。

## 编写测试代码的好处
* 提供描述组件行为的文档
* 节省手动测试的时间
* 减少研发新特性时产生的bug
* 改进设计
* 促进重构
自动化测试使得团队中的开发者可以维护复杂的基础代码.

## 准备工作
在Vue中,推荐使用Mocha + Chai或者(Jest).要完成测试任务,需要测试框架(跑测试), 断言库(编写测试) 和变成框架特有的测试套件.Mocha是测试框架, Chai是断言库,Jest同时包含两者.

vue中的组件等测试代码的编写需要vue-test-utils套件支持。

### 新建vue项目时
* 选择特性 Unit Testing 和E2E Testing
<img src="/static/img/test1.png">
* 单元测试解决方案选择: Jest
<img src="/static/img/test2.png">
* 端到端测试解决方案选择:Cypress
<img src="/static/img/test3.png">
### 在已存在的项目中集成
运行命令:
```bash
vue add @vue/unit-jest 和 vue add @vue/e2e-cypress
```
## 编写单元测试
单元测试(unit testing), 是指对软件中的最小可测试单元进行检查和验证.
* 新建 test/unit/xxx.spec.js (.spec.js后缀名是命名规范)

```js
function add(num1, num2) {
    return num1 + num2
}
// 测试套件 test suite
describe('Kaikeba', () => {
    // 测试用例 test case
    it('测试add函数', () => {
        // 断言 assert
        expect(add(1, 3)).toBe(3)
        expect(add(1, 3)).toBe(4)
        expect(add(-2, 3)).toBe(1)
    })
})
```
## 执行单元测试
执行命令: 
```bash
npm run test:unit
```
## 断言API简介
* describe: 定义一个测试套件
* it: 定义一个测试用例
* expect: 断言的判断条件(Doc: https://jestjs.io/docs/zh-Hans/expect)

## 测试Vue组件
vue官方提供了用于单元测试的使用工具库 @vue/test-utils (Doc: https://vue-test-utils.vuejs.org/zh/guides/)

创建一个vue组件components/click.vue
```html
<template>
    <div>
        <span>{{ message }}</span>
        <button @click="changeMsg">点击</button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                message: 'vue-text'
            }
        },
        created() {
            this.message = 'hello'
        },
        methods: {
            changeMsg() {
                this.message = '按钮点击'
            }
        }
    }
</script>
```
测试该组件, test/unit/click.spec.js

```js
import click from '@/components/click.vue'
describe('click.vue', () => {
    // 检查组件选项
    it('要求设置created生命周期', () => {
        expect(typeof click.created).toBe('function')
    })
    it('message初始值是vue-test', () => {
        // 检查data函数存在性
        expect(typeof click.data).toBe('function')
        // 检查data返回的默认值
        const defaultData = click.data()
        expect(defaultData.message).toBe('vue-test')
    })
})
```
### 检查mounted之后预期结果
使用@vue/test-utils挂载组件
```js
import { mount } from '@vue/test-utils'
import clickComp from '@/components/click.vue'

it('mount之后测data是hello', () => {
    const vm = new Vue(clickComp).$mount()
    expect(vm.message).toBe('hello')
})
it("按钮点击后", () => {
    const wrapper = mount(clickComp);
    wrapper.find("button").trigger("click");
    // 测试数据变化
    expect(wrapper.vm.message).toBe("按钮点击");
    // 测试html渲染结果
    expect(wrapper.find("span").html()).toBe("<span>按钮点击</span>");
    // 等效的方式
    expect(wrapper.find("span").text()).toBe("按钮点击");
});
```
### 测试覆盖率
jest自带覆盖率,如果用的mocha,需要使用istanbul来统计覆盖率
package.json里修改jest配置

```js
{
    "jest": {
        "collectCoverage": true,
        "collectCoverageFrom": ["src/**/*.{js,vue}"],
    }
}
```
若采用独立配置, 则修改jest.config.js
```js
module.exports = {
    "collectCoverage": true,
    "collectCoverageFrom": ["src/**/*.{js,vue}"]
}
```
再执行 npm run test:unit
* %stmts是语句覆盖率(statement coverage):是不是每个语句都执行了?
* %Branch分支覆盖率(branch coverage):是不是每个if代码块都执行了?
* %Funcs函数覆盖率(function coverage):是不是每个函数都调用了?
* %Lines行覆盖率(line coverage):是不是每一行都执行了?

Vue组件单元测试cookbook(Doc: https://cn.vuejs.org/v2/cookbook/unit-testing-vue-components.html)
VueTestUtils使用指南(Doc: https://vue-test-utils.vuejs.org/zh/)
## E2E测试
借用浏览器的能力,站在用户测试人员的角度,输入框,点击按钮等,完全模拟用户, 这个和具体的框架关系不大,完全模拟浏览器行为.
### 运行E2E测试
cypress Doc : https://docs.cypress.io/api/introduction/api.html
```bash
npm run test:e2e
```
修改e2e/spec/test.js
```js
describe('端到端测试', () => {
    it('访问', () => {
        cy.visit('/')
        cy.contains('h1', 'Welcome to Your Vue.js App')
        cy.get('button').click()
        cy.contains('span', '按钮点击')
    })
})
```
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
vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。你也可以使用 package.json 中的 vue 字段，但是注意这种写法需要你严格遵照 JSON 的格式来写。

创建vue.config.js, 指定应用上下文, 端口号,主页title
```js
// vue.config .js
const port = 8080
const title = 'vue项目最佳实践'

module.exports = {
    publicPath: '/best-practice', // 部署应用包时的基本URL
    devServer: {
        port: port,
    },
    configureWebpack: {
        // 向 index.html注入标题
        name: title
    }
}
```
```html
<!-- index.html -->
<title><%= webpackConfig.name %></title>
```
### 链式操作
文档: <a href="https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans">webpack-chain</a>
案例: svg icon的引入
安装依赖: svg-sprite-loader
```bash
npm i svg-sprite-loader -D
```
下载图标保存在src/icons/svg目录下
配置 vue.config.js
```js
const path = require('path')
// resolver函数获取 绝对路径
function resolve(dir) {
    return path.join(__dirname, dir)
}

chainWebpack(config) {
    // 配置svg规则 排除icons目录中svg文件处理
    config.module
        .rule("svg")
            .exclude.add(resolve("src/icons"))
            .end()
    // 新增icons规则, 设置svg-sprite-loader 处理icons目录中的svg
    config.module
        .rule("icons")
            .test(/\.svg/)
                .include.add(resolve("src/icons"))
                .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
                .options({ symbolId: "icon-[name]"})
                .end()
}
```
图标自动导入

```js
// icons/index.js
const req = require.context('./svg', false, /\.svg/)
req.keys().map(req)
```
创建SvgIcon组件 ./components/SvgIcon.vue

```
<template>
    <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
        <use :xlink:href="iconName" />
    </svg>
</template>
<script>
    export default {
        name: 'SvgIcon',
        props: {
            iconClass: {
                type: String,
                required: true
            },
            className: {
                type: String,
                default: ''
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'

                }
            }
        }
    }
</script>
<style scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
```

## 权限控制和动态路由
### 路由定义
路由分为两种: constantRoutes 和 asyncRoutes
router.js
```js
import Vue from "vue";
import Router from "vue-router";
import Layout from '@/layout'; // 布局页
Vue.use(Router);

// 通用页面:不需要守卫,可直接访问
export const constRoutes = [
    {
        path: "/login",
        component: () => import("@/views/Login"),
        hidden: true // 导航菜单忽略该项
    },
    {
        path: "/",
        component: Layout,// 应用布局
        redirect: "/home",
        children: [
            {
                path: "home",
                component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
                name: "home",
                meta: {
                    title: "Home", // 导航菜单项标题
                    icon: "qq" // 导航菜单项图标
                }
            }
        ]
    }
];
// 权限页面:受保护页面,要求用户登录并拥有访问权限的角色才能访问
export const asyncRoutes = [
    {
        path: "/about",
        component: Layout,
        redirect: "/about/index",    
        children: [
            {
            path: "index",
                component: () => import(/* webpackChunkName: "home" */ "@/views/About.vue"),
                name: "about",
                meta: {
                title: "About",
                icon: "qq",
                roles: ['admin', 'editor']
                },
            }
        ]
    }
];
export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: constRoutes
});
```
创建布局页面, layout/index.vue
```html
<template>
 <div class="app-wrapper">
   <!-- <sidebar class="sidebar-container" /> -->
   <div class="main-container">
     <router-view />
   </div>
 </div>
</template>
```
创建用户登录页面, views/Login.vue
```html
<template>
 <div>
   <h2>用户登录</h2>
   <div>
     <input type="text" v-model="username">
     <button @click="login">登录</button>
   </div>
 </div>
</template>
<script>
export default {
    data() {
        return {
            username: "admin"
        };
    },
    methods: {
        login() {}
    }
};
</script>
```
### 用户登录状态维护
vuex 根模块实现 vuex/store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {user}
})
export default store
```

user模块: 维护用户数据,处理用户登录等, vuex/modules/user.js

```js
const state = {
    token: localStorage.getItem('token'),
    // 其他用户信息
};
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    }
};
const actions = {
    // 模拟用户登录
    login({ commit }, userInfo) {
        const { username } = userInfo;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === "admin" || username === "jerry") {
                    commit("SET_TOKEN", username);
                    localStorage.setItem('token', username);
                    resolve();
                } else {
                    reject("用户名、密码错误");
                }
            }, 1000);
        });
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};
```
请求登录, Login.vue

```js
// 登录函数
login() {
   this.$store.dispatch("user/login", { username: this.username })
        .then(() => {
            this.$router.push({ path: this.$route.query.redirect || "/" });
        })
        .catch(error => {
            alert(error);
        });
}
```
### 路由守卫
在进入路由前,先进行登录验证,如未登录,跳转至登录页面.
创建src/permission.js, 并在main.js中引入
```js
import router from './router'
const whiteList = ['/login'] // 无需令牌白名单

router.beforeEach((to, from, next) => {
    // 获取令牌判断用户是否登录
    const hasToken = localStorage.getItem('token')
    // 已登录
    if (hasToken) {
        if (to.path === '/login') {
            // 若已登录没有必要显示登录页,重定向至首页
            next({ path: '/' })
        } else {        
            // 去其他路由,暂时放过
            next()  
            // 接下来执行用户角色逻辑, todo
        }
    } else {// 未登录
        if (whiteList.indexOf(to.path) !== -1) {
            // 白名单中路由放过
            next()
        } else {
            // 重定向至登录页
            next(`/login?redirect=${to.path}`)
        }
    }
})
```
### 用户角色获取和维护
添加用户角色和获取逻辑, vuex/modules/user.js
```js
const state = {
 roles: []
}
const mutations = {
    setRoles(state, roles) {
        state.roles = roles
    }
}
const actions = {
    // 模拟获取用户信息,角色和令牌内容一致
    getInfo({ commit, state }) {
        return new Promise(() => {
            SetTimerout(() => {
                let roles = state.token ==='admin' ? ['admin'] : ['editor']
                commit("setRoles", roles)
                resolve({ roles })
            }, 1000)
        })
    }
}

module.exports = {
    state,
    mutations,
    actions
}
```
获取用户角色,判断用户是否拥有访问权限, permission.js
```js
import store from './store.js'

const hasRoles = store.state.user.roles && store.state.user.roles.length > 0
if (hasRoles) {
    next() //继续即可
} else {
    try {
        // 先请求获取用户信息
        const { roles } = await store.dispatch('user/getInfo')
        // 动态路由生成, todo
        next() 
    } catch (error) {
        // 出错需重置令牌并重新登录(令牌过期, 网路错误等原因)
        await store.dispatch('user/resetToken')
        next(`/login?redirect=${to.path}`)
        alert(error || '未知错误')
    }
}
```
令牌重置, vuex/modules/user.js

```js
// 清除令牌 写在action中
resetToken({ commit }) {
    return new Promise(resolve => {
       commit("SET_TOKEN", "");
       commit("SET_ROLES", []);
       localStorage.removeItem('token');
       resolve();
    });
}
```
### 添加动态路由
创建permission模块, vuex/modules/permission.js
```js
import { asyncRoutes, constRoutes } from "@/router";
const state = {
    routes: [], // 完整路由表
    addRoutes: [] // 用户可访问路由表
};
const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = constRoutes.concat(routes);
    }
};
const actions = {
    // 路由生成:在得到用户角色后会第一时间调用
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            // 根据角色做过滤处理
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);;
            commit("SET_ROUTES", accessedRoutes);
            resolve(accessedRoutes);

        });
    }
};
export function filterAsyncRoutes(routes, roles) {
    const res = [];
    routes.forEach(route => {
        // 复制一份
        const tmp = { ...route };
        // 如果用户有访问权则加入结果路由表
        if (hasPermission(roles, tmp)) {
            // 如果存在子路由则递归过滤之
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);

            }
            res.push(tmp);

        }
    });
    return res;
}

function hasPermission(roles, route) {
    // 如果当前路由有roles字段则需判断用户访问权限
    if (route.meta && route.meta.roles) {
        // 若用户拥有的角色中有被包含在待判定路由角色表中的则拥有访问权
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        // 没有设置roles则无需判定即可访问
        return true;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
```
调用路由生成逻辑, ./permission.js
```js
// 根据当前用户角色动态生成路由
const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
// 添加这些路由至路由器
router.addRoutes(accessRoutes)
// 继续路由切换,确保addRoutes完成
next({ ...to, replace: true })
```
异步从服务端获取的路由表
```js
// 前端组件名和组件映射表
const map = {
    login: require('login/index').default // 同步的方式
    // login: () => import('login/index')      // 异步的方式
}
// 服务端返回的map类似于
const serviceMap = [
    { path: '/login', component: 'login', hidden: true }
]
// 遍历serviceMap,将component替换为map[component],动态生成asyncRoutes
function mapComponent(route) {
    route.component = serviceMap[route.component];
    if (route.children) {
        route.children = route.children.map(child => mapComponent(child))
    }
    return route
}
```
#### 按钮权限
封装一个指令v-permission, 从而实现按钮级别的权限控制, src/directive/permission.js
```js
import store from "@/store";
const permission = {
    inserted(el, binding) {
        // 获取指令的值:按钮要求的角色数组
        const { value: pRoles } = binding;
        // 获取用户角色
        const roles = store.getters && store.getters.roles;
        if (pRoles && pRoles instanceof Array && pRoles.length > 0) {
            // 判断用户角色中是否有按钮要求的角色
            const hasPermission = roles.some(role => {
                return pRoles.includes(role);
            });
            // 如果没有权限则删除当前dom
            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el);
            }
        } else {
            throw new Error(`需要指定按钮要求角色数组,如v-permission="['admin','editor']"`);
        }
    }
};
export default permission;
```
注册指令, main.js
```js
import vPermission from "./directive/permission";
Vue.directive("permission", vPermission);
```
该指令只能删除挂载指令的元素,对于那些额外生成的和指令无关的元素无能为力,比如:
```html
<el-tabs>
<el-tab-pane label="用户管理" name="first" v-permission="['admin','editor']">用户管理</el-tab-pane>
<el-tab-pane label="配置管理" name="second" v-permission="['admin','editor']">配置管理</el-tab-pane>
<el-tab-pane label="角色管理" name="third" v-permission="['admin']">角色管理</el-tab-pane>
<el-tab-pane label="定时任务补偿" name="fourth" v-permission="['admin', 'editor']">定时任务补偿</el-tab-pane>
</el-tabs>
```
用v-if实现:
```html
<template>
    <el-tab-pane v-if="checkPermission(['admin'])">
</template>
<script>
export default {
    methods: {
        checkPermission(permissionRoles) {
            return roles.some(role => {
                return permissionRoles.includes(role);
            });
        }
    }
}
</script>
```
自定义指令参考: https://cn.vuejs.org/v2/guide/custom-directive.html

### 导航菜单生成
sideMenu/index.vue
```html
<template>
    <div>
        <ul>
            <!-- 2.遍历permission_routes -->
            <!-- 传递base-path是由于子路由是相对地址 -->
            <item :model="route" v-for="route in permission_routes" :key="route.path" :base-path="route.path"></item>
        </ul>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import Item from "./Item"; // 修改引入
    export default {
        components: { Item },
        computed: {
            ...mapGetters(["permission_routes"])
        }
    };
</script>
```
Item.vue改造
```html
<template>
    <!-- 1.hidden存在则不显示 -->
    <li v-if="!model.hidden">
        <div @click="toggle">
            <!-- 2.设置icon才显示图标 -->
            <svg-icon v-if="hasIcon" :icon-class="model.meta.icon"></svg-icon>
            <span v-if="isFolder">
                <!-- 3.设置标题才显示 -->
                <span v-if="hasTitle">{{model.meta.title}}</span>
                [{{open ? '-' : '+'}}]
            </span>
            <!-- 4.如果是叶子节点,显示为链接 -->
            <template v-else>
                <router-link :to="resolvePath(model.path)">{{title}}</router-link>
            </template>
        </div>
        <!-- 5.子树设置base-path -->
        <ul v-show="open" v-if="isFolder">
            <item class="item" v-for="route in model.children" :model="route" :key="route.path"
                :base-path="resolvePath(model.path)"></item>
        </ul>
    </li>
</template>
<script>
    // resolvePath方法需要用到path库
    import path from 'path'
    export default {
        name: "Item",
        props: {
            // 新增basePath保存父路由path
            basePath: {
                type: String,
                default: ''
            }
        },
        computed: {
            hasIcon() { return this.model.meta && this.model.meta.icon },
            hasTitle() { return this.model.meta && this.model.meta.title },
            title() {
                return this.hasTitle
                    ? this.model.meta.title
                    : this.model.name
                        ? this.model.name
                        : this.model.path;
            }
        },
        methods: {
            // 拼接子路由完整path
            resolvePath(routePath) {
                return path.resolve(this.basePath, routePath)
            }
        }
    };
</script>
```
#### 利用element做一个更高规格的导航菜单
创建侧边栏组件, components/sidebar/index.vue
```html
<template>
    <div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :background-color="variables.menuBg" :text-color="variables.menuText"
                :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false"
                mode="vertical">
                <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route"
                    :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import SidebarItem from "./SidebarItem";
    export default {
        components: { SidebarItem },
        computed: {
            ...mapGetters(["permission_routes"]),
            activeMenu() {
                const route = this.$route;
                const { meta, path } = route;
                // 默认激活项
                if (meta.activeMenu) {
                    return meta.activeMenu;

                }
                return path;
            },
            variables() {
                return {
                    menuText: "#bfcbd9",
                    menuActiveText: "#409EFF",
                    menuBg: "#304156"
                };
            }
        }
    };
</script>
```
创建 侧边栏项目组件, layout/components/sidebar/sidebarItem.vue
```html
<template>
    <div v-if="!item.hidden" class="menu-wrapper">

        <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
            <router-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
                    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </router-link>
        </template>
        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper- append-to-body>
            <template v-slot:title>
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                :base-path="resolvePath(child.path)" class="nest-menu" />
        </el-submenu>
    </div>
</template>
<script>
    import path from 'path'
    import Item from './Item'
    export default {
        name: 'SidebarItem',
        components: { Item },
        props: {
            // route object
            item: {
                type: Object,
                required: true

            },
            isNest: {
                type: Boolean,
                default: false

            },
            basePath: {
                type: String,
                default: ''

            }
        },
        data() {
            this.onlyOneChild = null
            return {}
        },
        methods: {
            hasOneShowingChild(children = [], parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false

                    } else {
                        // 如果只有一个子菜单时设置
                        this.onlyOneChild = item
                        return true
                    }
                })
                // 当只有一个子路由,该子路由默认显示
                if (showingChildren.length === 1) {
                    return true
                }
                // 没有子路由则显示父路由
                if (showingChildren.length === 0) {
                    this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                    return true
                }
                return false
            },
            resolvePath(routePath) {
                return path.resolve(this.basePath, routePath)
            }
        }
    }
</script>
```

创建侧边栏菜单项组件, layout/components/sidebar/Item.vue
```html
<script>
    export default {
        name: 'MenuItem',
        functional: true,
        props: {
            icon: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            }
        },
        render(h, context) {
            const { icon, title } = context.props
            const vnodes = []
            if (icon) {
                vnodes.push(<svg-icon icon-class={icon} />)
            }
            if (title) {
                vnodes.push(<span slot='title'>{(title)}</span>)
            }
            return vnodes
        }
    }
</script>
```
测试: layout/index.vue中添加sidebar

```html
<script>
    import Sidebar from '@/components/sidebar'
    export default {
        components: {
            Sidebar
        },
    }
</script>
```
### 面包屑导航
面包屑导航通过$route.matched数组动态生成的.

简版实现, 创建./components/Bread.vue
```html
<template>
    <div>
        <span v-for="(item, idx) in items" :key="item.path">
            <!-- 最后一项时只显示文本 -->
            <span v-if="idx === items.length - 1">{{item.meta.title}}</span>
            <!-- 否则显示超链接 -->
            <span v-else>
                <router-link :to="item">{{item.meta.title}}</router-link>
                <span>/</span>
            </span>
        </span>
    </div>
</template>
<script>
    export default {
        computed: {
            items() {
                console.log(this.$route.matched);
                // 根据matched数组获取面包屑数组
                // 要求必须有title且breadcrumb不为false
                return this.$route.matched.filter(
                    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
                );
            }
        }
    };
</script>
```
创建Breadcrumb, ./components/Breadcrumb.vue
```html
<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span v-if="item.redirect==='noRedirect'||index==levelList.length-1"
                    class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>
<script>
    import pathToRegexp from "path-to-regexp";
    export default {
        data() {
            return {
                levelList: null
            };
        },
        watch: {
            $route: {
                handler(route) {
                    this.getBreadcrumb();
                },
                immediate: true
            }
        },
        methods: {
            getBreadcrumb() {
                console.log(this.$route.matched);
                // 面包屑仅显示包含meta.title且item.meta.breadcrumb不为false的路由
                let matched = this.$route.matched.filter(
                    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
                );
                // 根路由
                const first = matched[0];
                // 根匹配只要不是home,就作为home下一级
                if (!this.isHome(first)) {
                    matched = [{
                        path: '/', redirect: "/home", meta: { title: "首页" }
                    }].concat(matched);
                }
                // 处理完指定到levelList
                this.levelList = matched
            },
            isHome(route) {
                const name = route && route.name;
                if (!name) {
                    return false;
                }
                return name.trim().toLocaleLowerCase() === "home".toLocaleLowerCase();
            },
            pathCompile(path) {
                const { params } = this.$route;
                var toPath = pathToRegexp.compile(path);
                return toPath(params);
            },
            handleLink(item) {
                const { redirect, path } = item;
                // 若存在重定向,按重定向走
                if (redirect) {
                    this.$router.push(redirect);
                    return;
                }
                // 编译path,避免存在路径参数
                this.$router.push(this.pathCompile(path));
            }
        }
    };
</script>
<style scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 8px;
    }
    .app-breadcrumb.el-breadcrumb .no-redirect {
        color: #97a8be;
        cursor: text;
    }
    /* breadcrumb transition */
    .breadcrumb-enter-active,
    .breadcrumb-leave-active {
        transition: all .5s;
    }
    .breadcrumb-enter,
    .breadcrumb-leave-active {
        opacity: 0;
        transform: translateX(20px);
    }
    .breadcrumb-move {
        transition: all .5s;
    }
    .breadcrumb-leave-active {
        position: absolute;
    }
</style>
```
### 数据交互
数据交互流程:
api service => requrest => local mock/esay-mock/server api

可能出现的问题分析:
1. 有时需要对请求头,响应进行统一预处理
2. 请求不同数据源时url会变化, 需要能根据环境自动修改url
3. 可能出现跨域的问题

#### 封装request
解决前两个问题需要统一封装请求代码.

安装axios
```bash
npm i axios -S
```
创建 @/utils/request.js
```js
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url基础地址,解决不同数据源url变化问题
    // withCredentials: true, // 跨域时若要发送cookies需设置该选项
    timeout: 5000 // 超时
});
// 请求拦截
service.interceptors.request.use(
    config => {
        // do something
        const token = localStorage.getItem('token')
        if (token) {
            // 设置令牌请求头
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        // 请求错误预处理
        //console.log(error) // for debug
        return Promise.reject(error);
    }
);
// 响应拦截
service.interceptors.response.use(
    // 通过自定义code判定响应状态,也可以通过HTTP状态码判定
    response => {
        // 仅返回数据部分
        const res = response.data;
        // code不为1则判定为一个错误
        if (res.code !== 1) {
            Message({
                message: res.message || "Error",
                type: "error",
                duration: 5 * 1000
            });
            // 假设:10008-非法令牌; 10012-其他客户端已登录; 10014-令牌过期;
            if (res.code === 10008 || res.code === 10012 || res.code === 10014) {
                // 重新登录
                MessageBox.confirm(
                    "登录状态异常,请重新登录",
                    "确认登录信息",

                    {
                        confirmButtonText: "重新登录",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    store.dispatch("user/resetToken").then(() => {
                        location.reload();
                    });
                });
            }
            return Promise.reject(new Error(res.message || "Error"));
        } else {
            return res;
        }
    },
    error => {
        //console.log("err" + error); // for debug
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);
export default service;
```
设置VUE_APP_BASE_API环境变量, 创建.env.development文件
```bash
# base api
VUE_APP_BASE_API = '/dev-api'
```
Vue下的环境变量和模式: https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F

测试代码, 创建@/api/user.js
```js
import request from '@/utils/request'
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}
export function getInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}
```
#### mock数据
数据模拟的两种常见的方式, 本地mock和线上easy-mock
本地mock: 修改vue.config.js, 给devServer添加相关代码
post请求需要额外安装依赖:
```bash
npm i body-parser -D
```
```js
const bodyParser = require("body-parser");
module.exports = {
    devServer: {
        before: app => {
            app.use(bodyParser.json());
            app.use(
                bodyParser.urlencoded({
                    extended: true
                })
            );
            app.post("/dev-api/user/login", (req, res) => {
                const { username } = req.body;
                if (username === "admin" || username === "jerry") {
                    res.json({
                        code: 1,
                        data: username
                    });
                } else {
                    res.json({
                        code: 10204,
                        message: "用户名或密码错误"
                    });
                }
            });
            app.get("/dev-api/user/info", (req, res) => {
                const auth = req.headers["authorization"];
                const roles = auth.split(' ')[1] === "admin" ? ["admin"] : ["editor"];
                res.json({
                    code: 1,
                    data: roles
                });
            });
        }
    }
```
调用接口, @/vuex/modules/user.js

```js
import { login, getInfo } from '@/api/user'

import { login, getInfo } from '@/api/user';
const actions = {
    login({ commit }, userInfo) {
        // 调用并处理结果,错误处理已拦截无需处理
        return login(userInfo).then((res) => {
            commit("SET_TOKEN", res.data);
            localStorage.setItem("token", res.data);

        });
        // ...之前代码不需要了
    },
    // get user info
    getInfo({ commit, state }) {
        return getInfo(state.token).then(({ data: roles }) => {
            commit("SET_ROLES", roles);
            return { roles }

        })
        // ...之前代码不需要了
    },
};
```
#### easy-mock
使用步骤:
1. 登录easy-mock: http://easy-mock.com/
2. 创建一个项目
3. 创建需要的接口
```js
// user/login
{
    "code": function({_req}) {
        const { username } = _req.body;
        if (username === "admin" || username === "jerry") {
            return 1
        } else {
            return 10008
        }
    },
    "data": function({_req}) {
        const { username } = _req.body;
        if (username === "admin" || username === "jerry") {
            return username
        } else {
            return ''
        }
    }
}
// user/info
{
    "code": 1,
        "data": function({_req}) {
        return _req.headers['authorization'].split(' ')[1] === 'admin' ? ['admin'] : ['editor']
    }
}
```

4. 调用: 修改base_url, .env.development
```bash
VUE_APP_BASE_API = 'https://easy-mock.com/mock/5cdcc3fdde625c6ccadfd70c/xxx-project'
```
#### 解决跨域问题
如果请求的接口在另一台服务器上, 开发时则需要设置代理避免跨域问题:

方法一:添加代理配置, vue.config.js
```js
{
    devServer: {
        port: port,
        proxy: {
            // 代理 /dev-api/user/login 到 http://127.0.0.1:3000/user/login
            [process.env.VUE_APP_BASE_API]: {
                target: `http://127.0.0.1:3000/`,
                changeOrigin: true,
                pathRewrite: { ["^" + process.env.VUE_APP_BASE_API]: "" }
            }
        }
    }
}
```
方法二: 创建一个独立的接口服务器, ~/test-server/index.js
```js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.post("/user/login", (req, res) => {
    const { username } = req.body;
    if (username === "admin" || username === "jerry") {
        res.json({
            code: 1,
            data: username
        });
    } else {
        res.json({
            code: 10204,
            message: "用户名或密码错误"
        });
    }
});
app.get("/user/info", (req, res) => {
    const roles = req.headers['authorization'].split(' ')[1] ? ["admin"] :["editor"];
    res.json({
        code: 1,
        data: roles
    });
});
app.listen(3000);
```
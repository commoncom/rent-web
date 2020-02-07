## TODO list

1、查询签约

①、增加根据houseId查询 

②、增加根据状态查询

2、通证管理

①、增加转账记录

②、增加授权记录

③、增加获取总量

④、考虑是否增加销毁Token功能

3、登录注册增加功能

①、增加信息修改。

②、增加退出功能。

③、增加密码找回和私钥找回功能。（考虑）

④、增加记录

4、房源管理

①、增加 退回Token

## 项目运行（nodejs 6.0+）

```bash
# 克隆到本地
git clone https://github.com/commoncom/rent-web.git

# 进入文件夹
cd rent-web

# 安装依赖
npm install 或 yarn(推荐)

# 开启本地服务器localhost:8088
npm run dev

# 发布环境
npm run build
```

## 路由配置

```js
import App from '../App'

export default [{
    path: '/',
    component: App,
    children: [{
        path: '',
        name: 'login',
        component: r => require.ensure([], () => r(require('../page/home')), 'home')
    }, {
        path: '/register',
        component: r => require.ensure([], () => r(require('../page/register')), 'register')
    }, {
        path: '/register/getstatus',
        component: r => require.ensure([], () => r(require('../page/register/getstauts.vue')), 'getstatus')
    }, {
        path: '/getaddr',
        component: r => require.ensure([], () => r(require('../page/getaddr')), 'getaddr')
    }, {
        path: '/auth',
        component: r => require.ensure([], () => r(require('../page/auth')), 'auth')
    }, {
        path: '/auth/getauth',
        component: r => require.ensure([], () => r(require('../page/auth/getauth.vue')), 'getauth')
    }, {
        path: '/release',
        component: r => require.ensure([], () => r(require('../page/release')), 'release')
    }, {
        path: '/gethouse',
        component: r => require.ensure([], () => r(require('../page/gethouse')), 'gethouse')
    }, {
        path: '/signagree',
        name: 'signagree',
        component: r => require.ensure([], () => r(require('../page/signagree')), 'signagree')
    }, {
        path: '/signagree/getsign',
        name: 'getsign',
        component: r => require.ensure([], () => r(require('../page/signagree/get_sign.vue')), 'getsign')
    }, {
        path: '/signagree/sign',
        name: 'sign',
        component: r => require.ensure([], () => r(require('../page/signagree/sign.vue')), 'sign')
    }, {
        path: '/withdraw',
        component: r => require.ensure([], () => r(require('../page/withdraw')), 'withdraw')
    }, {
        path: '/checkbreak',
        component: r => require.ensure([], () => r(require('../page/checkbreak')), 'checkbreak')
    }, {
        path: '/requestsign',
        component: r => require.ensure([], () => r(require('../page/requestsign')), 'requestsign')
    }, {
        path: '/token/transfer',
        component: r => require.ensure([], () => r(require('../page/token')), 'transfer')
    }, {
        path: '/token/aprrove',
        component: r => require.ensure([], () => r(require('../page/token/approve.vue')), 'aprrove')
    }, {
        path: '/token/getbalance',
        component: r => require.ensure([], () => r(require('../page/token/getbalance.vue')), 'getbalance')
    }, {
        path: '/comment/getcomment',
        name: 'getcomment',
        component: r => require.ensure([], () => r(require('../page/comment/get_comment.vue')), 'getcomment')
    }] 
}]
```

## 创建vue实例

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'

Vue.use(VueRouter)
const router = new VueRouter({
    routes
})

new Vue({
    router,
    store,
}).$mount('#app')
```

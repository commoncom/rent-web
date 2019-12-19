import App from '../App'

export default [{
    path: '/',
    component: App,
    children: [{
        path: '',
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
        path: '/withdraw',
        component: r => require.ensure([], () => r(require('../page/withdraw')), 'withdraw')
    }, {
        path: '/breakcontract',
        component: r => require.ensure([], () => r(require('../page/breakcontract')), 'breakcontract')
    }, {
        path: '/checkbreak',
        component: r => require.ensure([], () => r(require('../page/checkbreak')), 'checkbreak')
    }] 
}]
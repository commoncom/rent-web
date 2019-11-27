import App from '../App'

export default [{
    path: '/',
    component: App,
    children: [{
        path: '',
        component: r => require.ensure([], () => r(require('../page/home')), 'home')
    }, {
        path: '/item',
        component: r => require.ensure([], () => r(require('../page/item')), 'item')
    }, {
        path: '/score',
        component: r => require.ensure([], () => r(require('../page/score')), 'score')
    }, {
        path: '/register',
        component: r => require.ensure([], () => r(require('../page/register')), 'register')
    }, {
        path: '/getaddr',
        component: r => require.ensure([], () => r(require('../page/getaddr')), 'getaddr')
    }, {
        path: '/auth',
        component: r => require.ensure([], () => r(require('../page/auth')), 'auth')
    }]
}]
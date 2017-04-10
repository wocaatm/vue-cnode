import Vue from 'vue'
import VueRouter from 'vue-router'
import List from './views/list'
import Login from './views/login'
import Detail from './views/detail'
import About from './views/about'
import Add from './views/add'
import User from './views/user'
import Message from './views/message'
import Start from './views/start'

Vue.use(VueRouter)

const routers = new VueRouter({
    mode: 'history',
    routes: [
        {name: 'start', path: '/', component: Start},
        {name: 'list', path: '/list', component: List},
        {name: 'login', path: '/login', component: Login},
        {name: 'detail', path: '/detail/:id', component: Detail},
        {name: 'about', path: '/about', component: About},
        {name: 'add', path: '/add', component: Add, meta: {requiresAuth: true}},
        {
            name: 'user',
            path: '/user/:username',
            component: User,
            meta: {requiresAuth: true}
        },
        {name: 'message', path: '/message/:accesstoken', component: Message, meta: {requiresAuth: true}}
    ]
})

export default routers
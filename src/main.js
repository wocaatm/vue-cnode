// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/common.css'
import './assets/css/reset.css'
import './assets/css/markdown.css'
import Alert from './libs/alert'
import router from './routers'
import store from './vuex/state'
import filters from './filters'

Vue.use(VueResource)
Vue.use(Alert)

Object.keys(filters).forEach(k => {
    Vue.filter(k, filters[k])
})

if (window.localStorage.user) {
    store.commit('login', JSON.parse(window.localStorage.user))
}

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.userInfo.userId) {
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        next()
    }
})

/* eslint-disable no-new */
new Vue({
    router,
    store
}).$mount('#app')

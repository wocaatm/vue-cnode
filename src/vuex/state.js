import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const infoStore = new Vuex.Store({
    state: {
        userInfo: {}
    },
    mutations: {
        login (state, userinfo) {
            state.userInfo = userinfo
        }
    }
})

export default infoStore
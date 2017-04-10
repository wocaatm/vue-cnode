<template>
    <div id="login">
        <na-head title='登录' :barshow="false"></na-head>
        <div class="login-container">
            <input type="text" size='36' placeholder="请输入accesstoken" v-model="accesstoken" ref='access'>
            <button @click='login'>登陆</button>
        </div>
    </div>
</template>

<script>
    import naHead from '../components/header'
    export default {
        data () {
            return {
                accesstoken: ''
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            }
        },
        created () {
            if (this.userInfo.userId) {
                this.$router.push({
                    path: '/'
                })
            }
        },
        methods: {
            login () {
                if (this.accesstoken.trim() === '') {
                    this.$alert('请输入36位accesstoken')
                    return
                }
                this.$http.post('https://cnodejs.org/api/v1/accesstoken', {accesstoken: this.accesstoken}).then(res => {
                    let info = res.body
                    let user = {
                        loginname: info.loginname,
                        avatar_url: info.avatar_url,
                        userId: info.id,
                        token: this.accesstoken
                    }
                    window.localStorage.user = JSON.stringify(user)
                    this.$store.commit('login', user)
                    this.$alert('登录成功', 500)
                    let redirect = decodeURIComponent(this.$route.query.redirect || '/')
                    setTimeout(() => {
                        this.$router.push({
                            path: redirect
                        })
                    }, 500)
                }).catch(error => {
                    if (error.status === 401) {
                        this.$alert('accesstoken错误')
                    }
                })
            }
        },
        components: {
            naHead
        }
    }
</script>

<style lang='stylus'>
    .login-container
        margin-top 100px
        padding 0 15px
        input
            width calc(100% - 10px)
            outline none
            padding 10px 0
            padding-left 10px
            border-bottom 1px solid #e8e8e8
        button
            outline none
            border none
            margin-top 20px
            width 100%
            text-algin center
            background #333
            border-radius 5px
            padding 10px 0
            color #fff
</style>
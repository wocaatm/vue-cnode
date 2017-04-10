<template>
    <div id="add">
        <na-head :title='opration'></na-head>
        <div class="add-container">
            <div class="row">
                <span>分 类</span>
                <input type="radio" name='type' value="share" v-model='tab' id="share"><label for="share">分享</label>
                <input type="radio" name="type" value="ask" v-model='tab' id='ask'><label for="ask">问答</label>
                <input type="radio" name="type" value="job" v-model='tab' id='job'><label for="job">招聘</label>
            </div>
            <div class="row">
                <span>标 题</span>
                <input type="text" v-model='title' placeholder="输入标题">
            </div>
            <div class="row textarea">
                <span>内 容</span>
                <textarea placeholder="支持markdown语法" v-model='content'></textarea>
            </div>
        </div>
        <div class="btn" @click='submit'>{{opration}}</div>
        <na-menu></na-menu>
    </div>
</template>

<script>
    import naHead from '../components/header'
    import naMenu from '../components/menu'

    export default {
        data () {
            return {
                topicId: '',
                topic: {},
                tab: 'share',
                title: '',
                content: ''
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            },
            opration () {
                if (this.topicId !== '') {
                    return '更新'
                } else {
                    return '发布'
                }
            }
        },
        created () {
            if (this.$route.params.topicId) {
                this.topicId = this.$route.params.topicId
                if (this.topicId) {
                    let url = `https://cnodejs.org/api/v1/topic/${this.topicId}`
                    this.$http.get(url, {params: {mdrender: false}}).then(res => {
                        this.tab = res.body.data.tab
                        this.title = res.body.data.title
                        this.content = res.body.data.content
                    })
                }
            }
        },
        methods: {
            add () {
                let url = 'https://cnodejs.org/api/v1/topics'
                let data = {
                    accesstoken: this.userInfo.token,
                    title: this.title,
                    tab: this.tab,
                    content: this.content
                }
                this.$http.post(url, data).then(res => {
                    if (res.body.success) {
                        this.$alert('发布成功', 1000)
                        setTimeout(() => {
                            this.$router.push({
                                path: `/user/${this.userInfo.loginname}`
                            })
                        }, 1000)
                    }
                })
            },
            update () {
                let url = 'https://cnodejs.org/api/v1/topics/update'
                let data = {
                    accesstoken: this.userInfo.token,
                    topic_id: this.topicId,
                    title: this.title,
                    tab: this.tab,
                    content: this.content
                }
                this.$http.post(url, data).then(res => {
                    if (res.body.success) {
                        this.$alert('更新成功', 1000)
                        setTimeout(() => {
                            this.$router.push({
                                path: `/user/${this.userInfo.loginname}`
                            })
                        }, 1000)
                    }
                })
            },
            submit () {
                if (this.topicId) {
                    this.update()
                } else {
                    this.add()
                }
            }
        },
        components: {
            naHead,
            naMenu
        }
    }
</script>

<style lang='stylus'>
    .add-container
        padding 46px 3% 0px
        .row
            padding 15px 0
            span
                display inline-block
                margin-right 10px
                font-size 14px
                color #666
            input[type='radio']
                vertical-align middle
                margin -3px 2px 0 10px
            input[type='text']
                width 70%
                padding 8px 10px
                border 1px solid #eee
                border-radius 5px
                &:focus
                    border 1px solid #1dd388
            &.textarea
                span
                    vertical-align middle
                textarea
                    width 70%
                    height 100px
                    padding 8px 10px
                    border 1px solid #eee
                    border-radius 5px
                    vertical-align middle
                    &:focus
                        border 1px solid #1dd388
    .btn
        width 96%
        margin 20px auto
        line-height 45px
        text-align center
        background #1dd388
        border-radius 5px
        color #fff
        text-shadow 2px 2px 1px #333
        font-size 18px
</style>
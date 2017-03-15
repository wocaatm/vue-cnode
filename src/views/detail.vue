<template>
    <div id="detail">
        <div v-if='topic.title' class="allContainer">
            <na-head title='主题'></na-head>
            <div class="detailContainer">
                <h2>{{topic.title}}</h2>
                <div class="detail-info">
                    <router-link :to="`/user/${topic.author.loginname}`" class="avatar">
                        <img :src="topic.author.avatar_url" alt="">
                    </router-link>
                    <div class="other-info">
                        <div class="username part">{{topic.author.loginname}}</div>
                        <div class="tab part"><span :class="topic.tab | getTabInfo(topic.top, topic.good, true)">{{topic.tab | getTabInfo(topic.top, topic.good, false)}}</span></div>
                        <div class="time part">{{topic.create_at | getTime}}</div>
                        <div class="collection part"><i class="fa fa-lg" :class="isCollect?'fa-heart': 'fa-heart-o'" @click='changeCollect'></i></div>
                    </div>
                </div>
            </div>
            <div class='markdown-body topic-content' v-html="topic.content">
            </div>
            <h3 class="comment-header">评论<span>{{topic.reply_count}}</span>条</h3>
            <div class="comment-container">
                <ul>
                    <li v-for='comment in topic.replies'>
                        <div class="comment-info">
                            <div class="comment-user-info">
                                <router-link :to="`/user/${comment.author.loginname}`" class="avatar">
                                    <img :src="comment.author.avatar_url" width="45px" height='45px'>
                                </router-link>
                                <span class="comment-username">{{comment.author.loginname}}</span>
                            </div>
                            <div class="opration">
                                <div class="comment-up">
                                    <i class="fa fa-thumbs-o-up" @click='upsAction(comment)'></i><span>{{comment.ups.length}}</span>
                                </div>
                                <div class="comment-reply" @click='replyToSome(comment)'>
                                    <i class="fa fa-mail-reply"></i>
                                </div>
                            </div>
                        </div>
                        <div class="comment-content markdown-body" v-html='comment.content'></div>
                    </li>
                </ul>
            </div>
        </div>
        <na-reply v-if='showReply' @closeReply='close' :comment='replyToWhich' :topicId='topic_id' @makeReply='pushComment'></na-reply>
        <div class="reply-btn" @click='replyToNo'>评论一发</div>
        <na-loading v-if='!topic.title'></na-loading>
        <na-menu></na-menu>
        <na-back-to-top v-if='showBackTop' @scrollState='changeState'></na-back-to-top>
    </div>
</template>

<script>
    import naHead from '../components/header'
    import naLoading from '../components/loading'
    import naMenu from '../components/menu'
    import naBackToTop from '../components/backtotop'
    import naReply from '../components/reply'

    export default {
        data () {
            return {
                topic_id: '',
                topic: {},
                isCollect: false,
                isCollectOpration: true,
                scrollY: 0,
                isScrolling: false,
                showReply: false,
                replyToWhich: {}
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            },
            showBackTop () {
                if (this.scrollY > 200 || this.isScrolling) {
                    return true
                } else {
                    return false
                }
            }
        },
        created () {
            this.topic_id = this.$route.params.id
            this.$http.get(`https://cnodejs.org/api/v1/topic/${this.topic_id}`, {params: {accesstoken: this.userInfo.token}}).then(res => {
                this.topic = res.body.data
                this.isCollect = res.body.data.is_collect
            })
        },
        mounted () {
            window.addEventListener('scroll', this.scroll)
        },
        components: {
            naHead,
            naLoading,
            naMenu,
            naBackToTop,
            naReply
        },
        methods: {
            changeCollect () {
                if (!this.checkLogin() || !this.isCollectOpration) return
                this.isCollectOpration = false
                let data = {
                    accesstoken: this.userInfo.token,
                    topic_id: this.topic_id
                }
                let url
                if (!this.isCollect) {
                    url = 'https://cnodejs.org/api/v1/topic_collect/collect'
                } else {
                    url = 'https://cnodejs.org/api/v1/topic_collect/de_collect'
                }
                this.$http.post(url, data).then(res => {
                    this.isCollectOpration = true
                    if (res.body.success) {
                        this.isCollect = !this.isCollect
                        if (this.isCollect) {
                            this.$alert('收藏成功', 1000)
                        } else {
                            this.$alert('取消收藏成功', 1000)
                        }
                    } else {
                        if (res.body.error_msg) {
                            this.$alert(res.body.error_msg, 1000)
                        } else {
                            this.$alert('失败', 1000)
                        }
                    }
                })
            },
            upsAction (item) {
                if (!this.checkLogin()) return
                if (!this.checkIsSelf(item)) return
                let url = `https://cnodejs.org/api/v1/reply/${item.id}/ups`
                this.$http.post(url, {accesstoken: this.userInfo.token}).then(res => {
                    if (res.body.success) {
                        if (res.body.action === 'up') {
                            this.$alert('点赞成功', 500)
                            item.ups.push(this.userInfo.userId)
                        } else if (res.body.action === 'down') {
                            let index = item.ups.indexOf(this.userInfo.userId)
                            item.ups.splice(index, 1)
                            this.$alert('取消点赞', 500)
                        }
                    } else {
                        this.$alert('失败', 500)
                    }
                })
            },
            scroll () {
                this.scrollY = window.pageYOffset || window.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
            },
            changeState (arg) {
                this.isScrolling = arg[0]
            },
            checkLogin () {
                if (!this.userInfo.userId) {
                    this.$router.push({
                        path: '/login'
                    })
                    return false
                }
                return true
            },
            close () {
                this.showReply = false
            },
            replyToSome (item) {
                if (!this.checkLogin()) return
                if (!this.checkIsSelf(item)) return
                this.showReply = true
                this.replyToWhich = item
            },
            replyToNo () {
                this.showReply = true
                this.replyToWhich = {}
            },
            pushComment (args) {
                let comment = {
                    id: args[0],
                    author: {
                        avatar_url: this.userInfo.avatar_url,
                        loginname: this.userInfo.loginname
                    },
                    content: args[1],
                    ups: []
                }
                this.topic.replies.push(comment)
            },
            checkIsSelf (item) {
                if (item.author.loginname === this.userInfo.loginname) {
                    this.$alert('本人评论不能操作')
                    return false
                }
                return true
            }
        }
    }
</script>

<style lang='stylus'>
    stick = 40px
    .allContainer
        min-height calc(100vh - 40px)
        padding-bottom stick
    .detailContainer
        padding-top 46px
        h2
            text-align center
            width 92%
            margin 10px auto
            padding 10px
            background rgb(88, 88, 88)
            color #fff
            border-radius 5px
        .detail-info
            display flex
            width 94%
            margin 5px auto
            align-items center
            .avatar
                flex-basis 45px
                width 45px
                height 45px
                border-radius 50%
                overflow hidden
                margin-right 15px
                img
                    widht 45px
                    height 45px
            .other-info
                flex 1
                display flex
                height 60px
                aling-items stretch
                flex-wrap wrap
                .part
                    flex-basis 50%
                    color #333
                    font-size 16px
                    &.tab
                        text-align right
                        span
                            display inline-block
                            width 40px
                            background #e74c3c
                            border-radius 4px
                            color #fff
                            padding: 5px 0;
                            font-size 10px
                            font-weight 400
                            text-align center
                            &.good
                                background #83d983
                            &.share
                                background #83d983
                            &.ask
                                background #f6bf19
                            &.job
                                background #8162d0
                            &.no-type
                                background #ccc
                    &.collection
                        text-align right
                        color red
                        i
                            margin-right 10px
    .topic-content
        padding 36px 15px 10px
    .comment-header
        padding 10px
        padding-left 30px
        color #333
        font-size 18px
        border 1px solid #d4d4d4
        span
            color #83c766
            display inline-block
            margin 0px 10px 
    .comment-info
        display flex
        justify-content space-between
        align-items center
        padding 20px 15px 0px
        font-size 18px
        .comment-user-info
            display flex
            align-items center
            img
                border-radius 50%
            .comment-username
                margin-left 10px
        .opration
            display flex
            justify-content space-between
            margin-right 10px
            .comment-up
                margin-right 15px
                span
                    margin-left 5px
    .comment-content
        border-bottom 1px solid #eee
        padding 5px 20px
        font-size 14px
    .reply-btn
        line-height stick
        margin-top - stick
        text-align center
        color #000
        text-shadow 2px 2px 2px #333
        border-radius 5px
</style>
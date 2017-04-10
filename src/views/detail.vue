<template>
    <div id="detail">
        <na-head title='主题'></na-head>
        <div v-if='topic.title' class="detail-container">  
            <div class="topic-info-container">
                <h2>{{topic.title}}</h2>
                <div class="topic-info">
                    <router-link :to="`/user/${topic.author.loginname}`" class="user-avatar">
                        <img :src="topic.author.avatar_url" alt="">
                    </router-link>
                    <div class="user-info">
                        <div class="username info-style">{{topic.author.loginname}}</div>
                        <div class="tab info-style"><span :class="topic.tab | getTabInfo(topic.top, topic.good, true)">{{topic.tab | getTabInfo(topic.top, topic.good, false)}}</span></div>
                        <div class="time info-style">{{topic.create_at | getTime}}</div>
                        <div class="collection info-style"><i class="fa fa-lg" :class="isCollect?'fa-heart': 'fa-heart-o'" @click='changeCollect'></i></div>
                    </div>
                </div>
            </div>
            <div class='markdown-body topic-content-container' v-html="topic.content">
            </div>
            <h3 class="topic-comment-header">评论<span>{{topic.reply_count}}</span>条</h3>
            <ul>
                <li v-for='comment in topic.replies'>
                    <div class="topic-comment-info">
                        <div class="comment-info-user">
                            <router-link :to="`/user/${comment.author.loginname}`" class="user-avatar">
                                <img :src="comment.author.avatar_url" width="45px" height='45px'>
                            </router-link>
                            <span class="username">{{comment.author.loginname}}</span>
                        </div>
                        <div class="comment-opration">
                            <div class="opration-up">
                                <i class="fa fa-thumbs-o-up" @click='upsAction(comment)'></i><span>{{comment.ups.length}}</span>
                            </div>
                            <div @click='replyToSome(comment)'>
                                <i class="fa fa-mail-reply"></i>
                            </div>
                        </div>
                    </div>
                    <div class="topic-comment-content markdown-body" v-html='comment.content'></div>
                </li>
            </ul>
        </div>
        <div class="reply-btn" @click='replyToNo'>评论一发</div>
        <na-reply v-if='showReply' :comment='replyToWhich' :topicId='topic_id' @closeReply='showReply = false' @makeReply='pushComment'></na-reply>
        <na-loading v-if='!topic.title'></na-loading>
        <na-menu></na-menu>
        <na-back-to-top v-if='scrollY > 200' @scrollToTop='scrollY = 0'></na-back-to-top>
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
                collectOprationFlag: true,
                scrollY: 0,
                showReply: false,
                replyToWhich: {}
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
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
        methods: {
            changeCollect () {
                if (!this.checkLogin() || !this.collectOprationFlag) return
                this.collectOprationFlag = false
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
                    this.collectOprationFlag = true
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
                if (!this.checkLogin() || !this.checkIsSelf(item)) return
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
            checkLogin () {
                if (!this.userInfo.userId) {
                    this.$router.push({
                        path: '/login',
                        query: {redirect: this.$route.fullPath}
                    })
                    return false
                }
                return true
            },
            replyToSome (item) {
                if (!this.checkLogin() || !this.checkIsSelf(item)) return
                this.showReply = true
                this.replyToWhich = item
            },
            replyToNo () {
                if (!this.checkLogin()) return
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
        },
        components: {
            naHead,
            naLoading,
            naMenu,
            naBackToTop,
            naReply
        }
    }
</script>

<style lang='stylus'>
    stick = 40px
    .detail-container
        min-height calc(100vh - 40px)
        padding-top 46px
        padding-bottom stick
        .topic-info-container
            h2
                width 92%
                margin 10px auto
                padding 10px
                border-radius 5px
                color #fff
                text-align center
                background rgb(88, 88, 88)     
            .topic-info
                display flex
                align-items center
                width 94%
                margin 5px auto
                .user-avatar
                    flex-basis 45px
                    overflow hidden
                    width 45px
                    height 45px
                    margin-right 15px
                    border-radius 50%
                    img
                        widht 45px
                        height 45px
                .user-info
                    display flex
                    flex 1
                    aling-items stretch
                    flex-wrap wrap
                    height 60px
                    .info-style
                        flex-basis 50%
                        color #333
                        font-size 16px
                        &.tab
                            text-align right
                            span
                                display inline-block
                                width 40px
                                padding: 5px 0
                                border-radius 4px
                                color #fff
                                font-size 10px
                                font-weight 400
                                text-align center
                                background #e74c3c
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
        .topic-content-container
            padding 36px 15px 10px
        .topic-comment-header
            padding 10px
            padding-left 30px
            color #333
            font-size 18px
            border 1px solid #d4d4d4
            span
                display inline-block
                margin 0px 10px 
                color #e91e63
        .topic-comment-info
            display flex
            justify-content space-between
            align-items center
            padding 20px 15px 0px
            font-size 18px
            .comment-info-user
                display flex
                align-items center
                img
                    border-radius 50%
                .username
                    margin-left 10px
            .comment-opration
                display flex
                justify-content space-between
                margin-right 10px
                .opration-up
                    margin-right 15px
                    span
                        margin-left 5px
        .topic-comment-content
            padding 5px 20px
            border-bottom 1px solid #eee
            font-size 14px
    .reply-btn
        margin-top - stick
        line-height stick
        text-align center
        color #000
        text-shadow 2px 2px 2px #333
        border-radius 5px
</style>
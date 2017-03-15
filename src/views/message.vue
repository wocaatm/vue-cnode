<template>
    <div id="message">
        <na-head title='消息'></na-head>
        <div class="message-tab">
            <span :class="{active:!tabFlag}" @click='tabFlag = 0'>未读消息</span>
            <span :class="{active:tabFlag}" @click='tabFlag = 1'>已读消息</span>
        </div>
        <div class="message-container" v-if='message.has_read_messages'>
            <div v-if='!tabFlag' class="mark-container">
                <div class="mark-all" v-if='message.hasnot_read_messages.length'>
                    <span @click='markAll'>标记所有为已读</span>
                </div>
                <ul v-if='message.hasnot_read_messages.length'>
                    <li v-for='message in message.hasnot_read_messages' class="item">
                        <div class="item-content">
                            <router-link :to="{name:'detail',params:{id:message.topic.id}}">
                                <h1>{{message.topic.title}}</h1>
                            </router-link>
                            <div class="item-content-bottom">
                                <div class="bottom-avatar">
                                    <router-link :to="`/user/${message.author.loginname}`">
                                        <img :src="message.author.avatar_url" alt="" width="45px" height='45px'>
                                    </router-link>
                                </div>
                                <div class="bottom-info">
                                    <p class="tips" v-if="message.type === 'at'">{{message.author.loginname}}评论中@了你:</p>
                                    <p v-else class="tips">{{message.author.loginname}}参与了主题的评论:</p>
                                    <p class="markdown-body info-content" v-html='message.reply.content'></p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="no-data">
                    <i class="fa fa-file-text-o fa-2x"></i>
                    <span>暂无数据</span>
                </div>
            </div>
            <div v-if='tabFlag'>
                <ul v-if='message.has_read_messages.length'>
                    <li v-for='message in message.has_read_messages' class="item">        
                        <div class="item-content">
                            <router-link :to="{name:'detail',params:{id:message.topic.id}}">
                                <h1>{{message.topic.title}}</h1>
                            </router-link>
                            <div class="item-content-bottom">
                                <div class="bottom-avatar">
                                    <router-link :to="`/user/${message.author.loginname}`">
                                        <img :src="message.author.avatar_url" alt="" width="45px" height='45px'>
                                    </router-link>
                                </div>
                                <div class="bottom-info">
                                    <p class="tips" v-if="message.type === 'at'">{{message.author.loginname}}评论中@了你:</p>
                                    <p v-else class="tips">{{message.author.loginname}}参与了主题的评论:</p>
                                    <p class="markdown-body info-content" v-html='message.reply.content'></p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="no-data">
                    <i class="fa fa-file-text-o fa-2x"></i>
                    <span>暂无数据</span>
                </div>
            </div>
        </div>
        <na-menu></na-menu>
    </div>
</template>

<script>
    import naHead from '../components/header'
    import naMenu from '../components/menu'
    import naBackToTop from '../components/backtotop'

    export default {
        data () {
            return {
                accesstoken: '',
                message: {},
                tabFlag: 0
            }
        },
        created () {
            this.accesstoken = this.$route.params.accesstoken
            let url = 'https://cnodejs.org/api/v1/messages'
            this.$http.get(url, {params: {accesstoken: this.accesstoken}}).then(res => {
                if (res.body.success) {
                    this.message = res.body.data
                } else {
                    this.$alert('获取数据失败', 1000)
                }
            })
        },
        methods: {
            markAll () {
                let url = 'https://cnodejs.org/api/v1/message/mark_all'
                this.$http.post(url, {accesstoken: this.accesstoken}).then(res => {
                    if (res.body.success) {
                        this.$alert('标记成功', 1000)
                        this.message.hasnot_read_messages.forEach((v, i) => {
                            this.message.has_read_messages.push(v)
                        })
                        this.message.hasnot_read_messages = []
                    }
                })
            }
        },
        components: {
            naHead,
            naMenu,
            naBackToTop
        }
    }
</script>

<style lang='stylus'>
    tabHeight = 45px
    .message-tab
        padding-top 46px
        height tabHeight
        line-height tabHeight
        display flex
        span
            flex-basis 50%
            text-align center
            border 1px solid #f5f5f5
            font-size 14px
            &.active
                border-bottom 2px solid #1dd388
    .message-container
        height calc(100vh - 93px)
        overflow-y auto
        .mark-container
            padding-top 40px
        .mark-all
            position fixed
            top (tabHeight * 2 + 1)
            left 0
            right 0
            line-height 40px
            text-align right
            background #fff
            font-size 12px
            border 1px solid #f5f5f5
            span
                display inline-block
                padding-right 20px
                height 100%
        .item
            padding 10px
            border-bottom 1px solid #f5f5f5
            .item-content
                .item-content-bottom
                    display flex
                    .bottom-avatar
                        flex-basis 45px
                        margin 14px 10px 0 0
                    .bottom-info
                        flex 1
                        max-width 84%
                        display flex
                        flex-wrap wrap
                        p.tips
                            padding 10px 0px
                            color #999
                            flex-basis 100%
                        p.info-content
                            flex-basis 100%
                            overflow-y auto
                        a
                            display inline-block
                h1
                    text-align center
                    border 1px solid #ddd
                    padding 5px 20px
                    border-radius 5px
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
            a
                color #333
                display block

        .no-data
            position absolute
            top 30%
            left 50%
            transform translate(-50%, 0)
            text-align center
            span
                display block
                margin-top 10px
</style>
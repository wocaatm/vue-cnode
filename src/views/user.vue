<template>
    <div id="user" v-if='userInfo.loginname'>
        <div class="user-top">
            <div class="rotate-container" @click='rotate' ref='rotateC'>
                <div class="rotata-avatar">
                    <img :src="userInfo.avatar_url" alt="" width="100%" height='100%'>
                </div>
                <div class="rotate-info" v-if='rotateFlag'>积分: {{userInfo.score}}</div>
            </div>
            <div class="user-info-container">
                <span>用户名: {{userInfo.loginname}}</span>
                <span>创建日期: {{ userInfo.create_at | getTime }}</span>
            </div>
            <div class="collect" @click='showCollectMethod'><i class="fa fa-heart fa-2x"></i></div>
        </div>
        <div class="user-tab">
            <span class="item" @click='tabControl=0' :class="{active: !tabControl}">发布的主题</span>
            <span class="item" @click='tabControl=1' :class="{active: tabControl}">参与的主题</span>
        </div>
        <div class="topic-container" ref='topicContainer'>
            <div v-if='!tabControl' :class="{'topics-container':isLoginUser}">
                <router-link :to="{name:'add'}" class='add-topic' v-if='isLoginUser'><i class="fa fa-plus fa-lg"></i></router-link>
                <ul v-if='userInfo.recent_topics.length'>
                    <li v-for='topic in userInfo.recent_topics'>
                        <router-link :to="{name:'detail',params:{id:topic.id}}" class='topic-info-container'>
                            <div class="topic-info">
                                <div class="avatar">
                                    <img :src="topic.author.avatar_url" alt="" width='64px' height='64px'>
                                </div>
                                <div class="topic-main-info">
                                    <div class="topic-title topic-style">{{topic.title}}</div>
                                    <div class="author-time topic-style">
                                        <span>{{topic.author.loginname}}</span>
                                        <span class="topic-edit" v-if='isLoginUser'>
                                            <router-link :to="{name:'add',params:{topicId:topic.id}}">
                                                <i class="fa fa-edit fa-lg"></i>
                                            </router-link>
                                        </span>
                                        <span v-else>最新回复 {{topic.last_reply_at | getTime}}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <div v-else class="no-topics-data">
                    <i class="fa fa-file-text-o fa-2x"></i>
                    <span>暂无数据</span>
                </div>
            </div>
            <div v-if='tabControl'>
                <ul v-if='userInfo.recent_replies.length'>
                    <li v-for='reply in userInfo.recent_replies'>
                        <router-link :to="{name:'detail',params:{id:reply.id}}" class='topic-info-container'>
                            <div class="topic-info">
                                <div class="avatar">
                                    <img :src="reply.author.avatar_url" alt="" width='64px' height='64px'>
                                </div>
                                <div class="topic-main-info">
                                    <div class="topic-title topic-style">{{reply.title}}</div>
                                    <div class="author-time topic-style">
                                        <span>{{reply.author.loginname}}</span>
                                        <span>最新回复:{{reply.last_reply_at | getTime}}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <div v-else class="no-topics-data">
                    <i class="fa fa-comment-o fa-2x"></i>
                    <span>暂无数据</span>
                </div>
            </div>
        </div>
        <na-menu></na-menu>
        <na-collect v-if='showCollect' :loginname='userName' :accesstoken="isLoginUser?userInfoSelf.token:''" @closeCollect='hideCollectMethod'></na-collect>
    </div>
</template>

<script>
    import naMenu from '../components/menu'
    import naCollect from '../components/collect'
    import Hammer from 'hammerjs'

    export default {
        data () {
            return {
                userName: '',
                userInfo: {},
                rotateFlag: false,
                tabControl: 0,
                isLoginUser: false,
                showCollect: false
            }
        },
        computed: {
            userInfoSelf () {
                return this.$store.state.userInfo
            }
        },
        mounted () {
            this.userName = this.$route.params.username
            if (this.userName === this.userInfoSelf.loginname) {
                this.isLoginUser = true
            }
            this.$http.get(`https://cnodejs.org/api/v1/user/${this.userName}`).then(res => {
                if (res.body.success) {
                    this.userInfo = res.body.data
                    this.$nextTick(() => {
                        this.bindOpration()
                    })
                } else {
                    this.$alert('获取用户信息失败', 1000)
                }
            })
        },
        methods: {
            rotate () {
                this.rotateFlag = !this.rotateFlag
                let classList = this.$refs.rotateC.classList
                if (this.rotateFlag) {
                    classList.add('rotateY')
                } else {
                    classList.remove('rotateY')
                }
            },
            showCollectMethod () {
                this.showCollect = true
                this.$refs.topicContainer.classList.add('no-scroll')
            },
            hideCollectMethod () {
                this.showCollect = false
                this.$refs.topicContainer.classList.remove('no-scroll')
            },
            bindOpration () {
                setTimeout(this.rotate.bind(this), 2000)
                let hammer = new Hammer(this.$refs.topicContainer)
                hammer.on('swipeleft', () => {
                    if (this.tabControl) return
                    this.tabControl = !this.tabControl
                })
                hammer.on('swiperight', () => {
                    if (!this.tabControl) return
                    this.tabControl = !this.tabControl
                })
            }
        },
        components: {
            naMenu,
            naCollect
        }
    }
</script>

<style lang='stylus'>
    avatar-radius = 140px 
    tab-line-height = calc(8vh - 3px)
    .user-top
        position relative
        box-sizing border-box
        height 40vh
        background #666
        .rotate-container
            position absolute
            top 50%
            left 50%
            overflow hidden
            width avatar-radius
            height avatar-radius
            margin-left - (@width / 2)
            margin-top - (@height / 2)
            border-radius (avatar-radius / 2)
            perspective 600px
            transform-style preserve-3d
            transition transform 0.6s
            &.rotateY
                transform rotateY(180deg)
            .rotata-avatar
                position absolute
                height 100%
                width 100%
                line-height 0
            .rotate-info
                position absolute
                z-index 1
                display flex
                flex-wrap wrap
                justify-content center
                align-items center
                height 100%
                width 100%
                color #fff
                background rgba(0,0,0,0.7)
                transform rotateY(180deg)
        .user-info-container
            position absolute
            bottom 0
            left 0
            right 0
            display flex
            justify-content space-between
            padding 0 15px
            font-size 14px
            line-height 40px
            color #fff
        .collect
            position absolute
            top 30px
            right 30px
            color red
    .user-tab
        display flex
        justify-content space-around
        line-height tab-line-height
        .item
            flex 1
            color #000
            text-align center
            border 1px solid #eee
            &:first-child
                border-right none
            &.active
                border-bottom 2px solid #1dd388
    .topic-container
        position relative
        overflow scroll
        height 52vh
        &.no-scroll
            overflow hidden
        .topics-container
            padding-top 50px
        .add-topic
            position fixed
            top 48vh
            left 0
            right 0
            z-index 10
            border-bottom 1px solid #eee
            line-height 50px
            text-align center
            color #1dd388
            background #fff
        .topic-info-container
            display block
            .topic-info
                display flex
                padding 10px
                .avatar
                    flex-basis 64px
                    overflow hidden
                    margin-right 10px
                    line-height 0
                    clip-path polygon(0 50%, 50% 0, 100% 50%, 50% 100%)
                .topic-main-info
                    display flex
                    flex 1
                    flex-wrap wrap
                    align-items space-between
                    overflow hidden
                    .topic-style
                        flex-basis 100%
                        line-height 32px
                        &.topic-title
                            overflow hidden
                            color #333
                            white-space nowrap
                            text-overflow ellipsis
                        &.author-time
                            display flex
                            justify-content space-between
                            span
                                color #666
                                font-size 14px
                                &.topic-edit
                                    width 32px
                                    a
                                        color inherit
                                        display block
        .no-topics-data
            position absolute
            left 50%
            top 80px
            text-align center
            transform translateX(-50%)
            span
                display block
</style>
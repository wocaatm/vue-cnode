<template>
    <div id="user" v-if='userInfo.loginname'>
        <div class="user-top">
            <div class="rotate-container" @click='rotate' ref='rotateC'>
                <div class="user-top-avatar">
                    <img :src="userInfo.avatar_url" alt="" width="100%" height='100%'>
                </div>
                <div class="user-top-info" v-if='rotateFlag'>积分: {{userInfo.score}}</div>
            </div>
            <div class="user-other-info">
                <span class="user-other-info-name">用户名: {{userInfo.loginname}}</span>
                <span>创建日期: {{ userInfo.create_at | getTime }}</span>
            </div>
            <div class="collect" @click='showCollectMethod'><i class="fa fa-heart fa-2x"></i></div>
        </div>
        <div class="user-tab">
            <span class="item" @click='tabControl=0' :class="{active: !tabControl}">发布的主题</span>
            <span class="item" @click='tabControl=1' :class="{active: tabControl}">参与的主题</span>
        </div>
        <div class="user-tab-content">
            <div v-if='!tabControl' :class="{'topics-container':isSelf}">
                <router-link :to="{name:'add'}" class='add-topics' v-if='isSelf'><i class="fa fa-plus fa-lg"></i></router-link>
                <ul v-if='userInfo.recent_topics.length'>
                    <li v-for='topic in userInfo.recent_topics'>
                        <router-link :to="{name:'detail',params:{id:topic.id}}" class='reply'>
                            <div class="reply-info">
                                <div class="avatar">
                                    <img :src="topic.author.avatar_url" alt="" width='64px' height='64px'>
                                </div>
                                <div class="other-info">
                                    <div class="title-name">{{topic.title}}</div>
                                    <div class="author-time">
                                        <span>{{topic.author.loginname}}</span>
                                        <span class="edit" v-if='isSelf'>
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
                <div v-else class="no-data">
                    <i class="fa fa-file-text-o fa-2x"></i>
                    <span>暂无数据</span>
                </div>
            </div>
            <div v-if='tabControl'>
                <ul v-if='userInfo.recent_replies.length'>
                    <li v-for='reply in userInfo.recent_replies'>
                        <router-link :to="{name:'detail',params:{id:reply.id}}" class='reply'>
                            <div class="reply-info">
                                <div class="avatar">
                                    <img :src="reply.author.avatar_url" alt="" width='64px' height='64px'>
                                </div>
                                <div class="other-info">
                                    <div class="title-name">{{reply.title}}</div>
                                    <div class="author-time">
                                        <span>{{reply.author.loginname}}</span>
                                        <span>{{reply.last_reply_at | getTime}}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <div v-else class="no-data">
                    <i class="fa fa-comment-o fa-2x"></i>
                    <span>暂无数据</span>
                </div>
            </div>
        </div>
        <na-menu></na-menu>
        <na-collect v-if='showCollect' :loginname='userName' :accesstoken="isSelf?userInfoSelf.token:''" @closeCollect='hideCollectMethod'></na-collect>
    </div>
</template>

<script>
    import naMenu from '../components/menu'
    import naCollect from '../components/collect'
    export default {
        data () {
            return {
                userName: '',
                userInfo: {},
                rotateFlag: false,
                tabControl: 0,
                isSelf: false,
                showCollect: false
            }
        },
        computed: {
            userInfoSelf () {
                return this.$store.state.userInfo
            }
        },
        created () {
            this.userName = this.$route.params.username
            if (this.userName === this.userInfoSelf.loginname) {
                this.isSelf = true
            }
            this.$http.get(`https://cnodejs.org/api/v1/user/${this.userName}`).then(res => {
                if (res.body.success) {
                    this.userInfo = res.body.data
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
                document.getElementsByClassName('user-tab-content')[0].classList.add('no-scroll')
            },
            hideCollectMethod () {
                this.showCollect = false
                document.getElementsByClassName('user-tab-content')[0].classList.remove('no-scroll')
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
        height 40vh
        box-sizing border-box
        background #666
        position relative
        .rotate-container
            position absolute
            top 50%
            left 50%
            width avatar-radius
            height avatar-radius
            margin-left - (@width / 2)
            margin-top - (@height / 2)
            border-radius (avatar-radius / 2)
            overflow hidden
            perspective 600px
            transform-style preserve-3d
            transition transform 0.6s
            &.rotateY
                transform rotateY(180deg)
            .user-top-avatar
                height 100%
                width 100%
                position absolute
                line-height 0
            .user-top-info
                height 100%
                width 100%
                position absolute
                z-index 1
                background rgba(0,0,0,0.7)
                color #fff
                display flex
                flex-wrap wrap
                justify-content center
                align-items center
                transform rotateY(180deg)
        .user-other-info
            position absolute
            bottom 0
            left 0
            right 0
            line-height 40px
            display flex
            justify-content space-between
            font-size 14px
            padding 0 15px
            color #fff
        .collect
            position absolute
            top 30px
            right 30px
            color red
    .user-tab
        line-height tab-line-height
        display flex
        justify-content space-around
        .item
            text-align center
            flex 1
            color #000
            border 1px solid #eee
            &:first-child
                border-right none
            &.active
                border-bottom 2px solid #1dd388
    .user-tab-content
        height 52vh
        overflow scroll
        position relative
        &.no-scroll
            overflow hidden
        .topics-container
            padding-top 50px
        .add-topics
            position fixed
            top 48vh
            left 0
            right 0
            line-height 50px
            text-align center
            color #1dd388
            border-bottom 1px solid #eee
            background #fff
        .reply
            display block
            .reply-info
                padding 10px
                display flex
                .avatar
                    flex-basis 64px
                    clip-path polygon(0 50%, 50% 0, 100% 50%, 50% 100%)
                    overflow hidden
                    line-height 0
                    margin-right 10px
                .other-info
                    flex 1
                    display flex
                    flex-wrap wrap
                    align-items space-between
                    overflow hidden
                    div
                        flex-basis 100%
                        line-height 32px
                        &.title-name
                            color #333
                            overflow hidden
                            white-space nowrap
                            text-overflow ellipsis
                        &.author-time
                            display flex
                            justify-content space-between
                            span
                                color #666
                                font-size 14px
                                &.edit
                                    width 32px
                                    a
                                        color inherit
                                        display block
        .no-data
            position absolute
            left 50%
            top 80px
            text-align center
            transform translateX(-50%)
            span
                display block
</style>
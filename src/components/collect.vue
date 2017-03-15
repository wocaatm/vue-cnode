<template>
    <transition name='collectAnimation'>
        <div id="collect">
            <div class="collect-close">
                <span class="collect-title">用户收藏</span>
                <span class="close" @click='closeCollect'><i class="fa fa-close fa-lg"></i></span>
            </div>
            <div v-if='show'>
                <ul v-if='collects.length'>
                    <li v-for='(collect, index) in collects'>
                        <router-link :to="{name:'detail',params:{id:collect.id}}" class='collect'>
                            <div class="collect-info">
                                <div class="avatar">
                                    <img :src="collect.author.avatar_url" alt="" width='64px' height='64px'>
                                </div>
                                <div class="other-info">
                                    <div class="title-name">{{collect.title}}</div>
                                    <div class="author-time">
                                        <span>{{collect.author.loginname}}</span>
                                        <a class="delete" @click.prevent='deleteCollect(collect.id,index)' v-if="accesstoken"><i class="fa fa-heart fa-lg"></i></a>
                                        </span>
                                        <span v-else>最新回复 {{collect.create_at | getTime}}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <div v-else class="no-data">
                    <i class="fa fa-file-text-o fa-2x"></i>
                    <p>暂无数据</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data () {
            return {
                collects: [],
                show: false
            }
        },
        props: {
            loginname: {
                type: String,
                required: true
            },
            accesstoken: {
                type: String
            }
        },
        created () {
            let url = `https://cnodejs.org/api/v1/topic_collect/${this.loginname}`
            this.$http.get(url).then(res => {
                if (res.body.success) {
                    this.collects = res.body.data
                    this.show = true
                } else {
                    this.$emit('closeCollect')
                    this.$alert('获取数据失败', 1500)
                }
            })
        },
        methods: {
            closeCollect () {
                this.$emit('closeCollect')
            },
            deleteCollect (id, index) {
                let url = 'https://cnodejs.org/api/v1/topic_collect/de_collect'
                let data = {
                    accesstoken: this.accesstoken,
                    topic_id: id
                }
                this.$http.post(url, data).then(res => {
                    if (res.body.success) {
                        this.$alert('取消成功', 1000)
                        this.collects.splice(index, 1)
                    } else {
                        if (res.body.error_msg) {
                            this.$alert(res.body.error_msg, 1000)
                        } else {
                            this.$alert('取消失败', 1000)
                        }
                    }
                })
            }
        }
    }
</script>

<style lang='stylus'>
    closeWidth = 50px
    #collect
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        background rgb(255,255,255)
        z-index 100
        transform-origin 50% 50%
        padding-top 50px
        overflow auto
        .collect-close
            position fixed
            top 0
            left 0
            right 0
            line-height 50px
            display flex
            justify-content space-between
            background #fff
            z-index 999
            span.collect-title
                flex 1
                padding-left closeWidth
                text-align center
                font-size 18px
                font-weight bold
            .close
                flex-basis closeWidth
                text-align center
        .collect
            display block
            overflow scroll
            .collect-info
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
                            a
                                margin-right 10px
                                color red
                                width 32px
                                text-align center
        .no-data
            margin-top 100px
            text-align center
            p
                margin-top 10px
    .collectAnimation-enter-active, .collectAnimation-leave-active
        transition all .4s ease-out
    .collectAnimation-enter, .collectAnimation-leave-active
        opacity 0
        transform scale(0.1)
</style>
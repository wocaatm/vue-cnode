<template>
    <transition name='collect-animation'>
        <div id="collect">
            <div class="collect-close">
                <span class="collect-title">用户收藏</span>
                <span class="close" @click='closeCollect'><i class="fa fa-close fa-lg"></i></span>
            </div>
            <div v-if='show'>
                <transition-group name="collect-list" tag="ul" v-if='collects.length'>
                    <li v-for='(collect, index) in collects' :key='collect.id' class='collect-item'>
                        <router-link :to="{name:'detail',params:{id:collect.id}}" class='collect-info-container'>
                            <div class="collect-info">
                                <div class="avatar">
                                    <img :src="collect.author.avatar_url" alt="" width='64px' height='64px'>
                                </div>
                                <div class="other-info">
                                    <div class="title-name collect-style">{{collect.title}}</div>
                                    <div class="author-time collect-style">
                                        <span>{{collect.author.loginname}}</span>
                                            <a class="delete" @click.prevent='deleteCollect(collect.id,index)' v-if="accesstoken"><i class="fa fa-heart fa-lg"></i></a>
                                        </span>
                                        <span v-else>最新回复 {{collect.create_at | getTime}}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </transition-group>
                <div v-else class="no-collect-data">
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
                let comfirm = window.confirm('取消收藏?')
                if (!comfirm) return
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
        z-index 100
        overflow auto
        padding-top 50px
        background rgb(255,255,255)
        transform-origin 50% 50%
        .collect-close
            display flex
            justify-content space-between
            position fixed
            top 0
            left 0
            right 0
            z-index 101
            line-height 50px
            background #fff
            span.collect-title
                flex 1
                padding-left closeWidth
                text-align center
                font-size 18px
                font-weight bold
            .close
                flex-basis closeWidth
                text-align center
        .collect-item
            transition all 0.3s
            .collect-info-container
                display block
                overflow scroll
                .collect-info
                    display flex
                    padding 10px
                    .avatar
                        flex-basis 64px
                        overflow hidden
                        margin-right 10px
                        line-height 0
                        clip-path polygon(0 50%, 50% 0, 100% 50%, 50% 100%)
                    .other-info
                        display flex
                        flex 1
                        flex-wrap wrap
                        align-items space-between
                        overflow hidden
                        .collect-style
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
                                    width 32px
                                    margin-right 10px
                                    color red
                                    text-align center
        .no-collect-data
            margin-top 100px
            text-align center
            p
                margin-top 10px
    .collect-animation-enter-active, .collect-animation-leave-active
        transition all .4s ease-out
    .collect-animation-enter, .collect-animation-leave-active
        opacity 0
        transform scale(0.1)
    .collect-list, .collect-list-leave-active
        opacity 0
        transform translateX(-100%)
</style>
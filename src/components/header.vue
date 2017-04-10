<template>
    <header>
        <span class="title fl">{{ title }}</span>
        <div class="opration fl" @click='showMore = !showMore'>
            <div class="icon">
                <span v-if='userInfo.loginname'>
                    <i class="fa fa-list-ul fa-lg"></i>
                </span>
                <span v-else class="login">
                    <router-link to='/login'><i class="fa fa-user-circle-o fa-lg"></i></router-link>
            </span>
            </div>
            <div class="opration-tab" v-if='showMore'>
                <ul>
                    <li class='tab-item'><router-link :to="`/user/${userInfo.loginname}`" class='item-content'><i class="fa fa-vcard fa-lg"></i>用户中心</router-link></li>
                    <li class='tab-item'><router-link :to="`/message/${userInfo.token}`" class='item-content'><i class="fa fa-commenting-o fa-lg"></i>消息<span v-if='messageCount' class="count">{{messageCount}}</span></router-link></li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        data () {
            return {
                messageCount: 0,
                showMore: false
            }
        },
        props: {
            title: {
                type: String,
                required: true
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            }
        },
        mounted () {
            if (this.userInfo.token) {
                this.getCount()
            }
        },
        methods: {
            getCount () {
                let url = 'https://cnodejs.org/api/v1/message/count'
                this.$http.get(url, {params: {accesstoken: this.userInfo.token}}).then(res => {
                    if (res.body.success && res.body.data) {
                        this.messageCount = res.body.data
                    }
                })
            }
        },
        watch: {
            '$route' (to, from) {
                this.getCount()
            }
        }
    }
</script>

<style lang='stylus'>
    header-height = 45px
    .title-overflow
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    header
        position fixed
        top 0
        left 0
        width 100%
        line-height header-height
        background rgb(255,255,255)
        border-bottom 1px solid #e8e8e8
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
        z-index 10
        color #333
        .opration
            width header-height
            text-align center
            color #333
            .icon
                span
                    display block
                    &.login a
                        display block
                        color #333
        .title
            width calc(100vw - 90px)
            padding-left 45px
            text-align center
            font-size 16px
            @extend .title-overflow
        .opration-tab
            position absolute
            border-radius 5px
            right 2px
            top 50px
            line-height normal
            background rgba(0,0,0,.8)
            .tab-item
                border-bottom 1px solid #fff
                &:last-child
                    border none
                .item-content
                    text-align left
                    padding 10px 20px
                    display block
                    color #fff
                    i
                        margin-right 15px
                    .count
                        display inline-block
                        text-align center
                        margin-left 8px
                        padding 0 5px
                        line-height 20px
                        border-radius 10px
                        background red
            &:after
                content ''
                position absolute
                top -20px
                right 10px
                width 0
                height 0
                border 10px solid
                border-color transparent transparent rgba(0,0,0,.8) transparent
</style>
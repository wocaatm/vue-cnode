<template>
    <transition name='replyAnimation'>
        <div id="reply" ref='reply'>
            <div class="close" @click='closeReply'><i class="fa fa-close fa-2x"></i></div>
            <div class="form-container">
                <textarea cols="30" rows="10" v-model='content'></textarea>
                <a href="javascript:void(0)" class="submit" @click.prevent='makeComment'>提交</a>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data () {
            return {
                content: ''
            }
        },
        props: {
            comment: {
                type: Object
            },
            topicId: {
                type: String,
                require: true
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo
            }
        },
        mounted () {
            this.$refs.reply.addEventListener('touchmove', e => {
                e.preventDefault()
            })
            if (this.comment.author) {
                this.content = `@${this.comment.author.loginname} `
            }
        },
        methods: {
            closeReply () {
                this.$emit('closeReply')
            },
            makeComment () {
                let url = `https://cnodejs.org/api/v1/topic/${this.topicId}/replies`
                let data = {
                    accesstoken: this.userInfo.token,
                    content: this.content,
                    reply_id: this.comment.id ? this.comment.id : ''
                }
                this.$http.post(url, data).then(res => {
                    if (res.body.success) {
                        this.$emit('closeReply')
                        this.$emit('makeReply', [res.body.reply_id, this.content])
                        this.$alert('评价成功', 1000)
                    } else {
                        this.$alert('评价失败', 1000)
                    }
                })
            }
        }
    }
</script>

<style lang='stylus'>
    #reply
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        background rgba(0,0,0,.8)
        z-index 100
        transform-origin 100% 100%
        .close
            position absolute
            right 30px
            top 30px
            color #fff
        .form-container
            position absolute
            width 80%
            left 50%
            top 45%
            transform translate(-50%,-50%)
            textarea
                width calc(100% - 20px)
                border none
                padding 10px
                border-radius 5px
                text-align left
            .submit
                display block
                width 100%
                margin-top 20px
                line-height 40px
                border-radius 5px
                background #de4c4c
                color #fff
                text-shadow 2px 2px 2px #333
                text-align center
    .replyAnimation-enter-active, .replyAnimation-leave-active
        transition all .4s ease-out
    .replyAnimation-enter, .replyAnimation-leave-active
        opacity 0
        transform scale(0.1)
</style>
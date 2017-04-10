<template>
    <transition name='replyAnimation'>
        <div id="reply" ref='reply'>
            <div class="form-container">
                <div class="textarea">
                    <textarea cols="30" rows="8" v-model='content' :placeholder="placeholder"></textarea>
                    <i class="fa fa-trash-o fa-lg clear" @click='clearInput'></i>
                </div>
                <a href="javascript:void(0)" class="submit" @click.prevent='makeComment'>提交</a>
            </div>
            <ul class='comment-tips-container'>
                <li class="item" v-for='tip in tips' @click='addComment($event)'>{{tip}}</li>
            </ul>
            <div class="close" @click='close'><i class="fa fa-close fa-2x"></i></div>
        </div>
    </transition>
</template>

<script>
    export default {
        data () {
            return {
                placeholder: '',
                content: '',
                tips: ['Mark', '6666', '赞', '已收藏', '感谢分享', '学习']
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
            },
            finalContent () {
                return this.placeholder + this.content + '[ --采用Cnode VueJs](https://github.com/wocaatm/vue-cnode)'
            }
        },
        mounted () {
            this.$refs.reply.addEventListener('touchmove', e => {
                e.preventDefault()
            })
            if (this.comment.author) {
                this.placeholder = `@${this.comment.author.loginname} `
            }
        },
        methods: {
            close () {
                this.$emit('closeReply')
            },
            makeComment () {
                let url = `https://cnodejs.org/api/v1/topic/${this.topicId}/replies`
                let data = {
                    accesstoken: this.userInfo.token,
                    content: this.finalContent,
                    reply_id: this.comment.id ? this.comment.id : ''
                }
                this.$http.post(url, data).then(res => {
                    if (res.body.success) {
                        this.$emit('closeReply')
                        this.$emit('makeReply', [res.body.reply_id, this.finalContent])
                        this.$alert('评价成功', 1000)
                    } else {
                        this.$alert('评价失败', 1000)
                    }
                })
            },
            addComment (e) {
                let content = e.target.innerHTML
                this.content += content + ' '
            },
            clearInput () {
                this.content = ''
            }
        }
    }
</script>

<style lang='stylus'>
    /*折角的minx*/
    folded-corner(background,size,angle=30deg)
        position relative
        background background
        background linear-gradient(angle - 180deg,transparent size,background 0)
        border-radius 4px
        x = size / sin(angle)
        y = size / cos(angle)
        &:before
            position absolute
            top 0
            right 0
            width y
            height x
            content ''
            background linear-gradient(to left bottom,transparent 50%,rgba(0,0,0,0.4) 0) no-repeat 100% 0
            transform translateY(y - x) rotate(2*angle - 90deg)
            transform-origin bottom right
            border-bottom-left-radius inherit
            box-shadow -0.2em 0.2em 0.3em -.1em rgba(0,0,0,.2)
    #reply
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        z-index 11
        padding 0px 10%
        background rgba(0,0,0,.8)
        transform-origin 100% 100%
        .form-container
            margin 30px auto 0px
            .textarea
                position relative
                textarea
                    width calc(100% - 20px)
                    padding 10px
                    border none
                    border-radius 5px
                    text-align left
                .clear
                    position absolute
                    right 0
                    bottom 6px
                    color #000
                    padding 10px
            .submit
                display block
                width 100%
                margin-top 20px
                border-radius 5px
                color #fff
                text-align center
                line-height 40px
                background #de4c4c
                text-shadow 2px 2px 2px #333
        .comment-tips-container
            display flex
            justify-content space-between
            flex-wrap wrap
            margin-top 10px
            .item
                flex-basis calc(30% - 8px)
                flex-shrink 0
                margin-top 10px
                padding 10px 4px
                font-size 13px
                text-align center
                folded-corner(#fff,0.75em,45deg)
        .close
            margin-top 30px
            color #fff
            text-align center
    .replyAnimation-enter-active, .replyAnimation-leave-active
        transition all .4s ease-out
    .replyAnimation-enter, .replyAnimation-leave-active
        opacity 0
        transform scale(0.1)
</style>
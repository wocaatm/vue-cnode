<template>
    <div id="list">
        <na-head :title='getTitleStr(searchInfo.tab)'></na-head>
        <section class="list-container">
            <ul class='list-ul'>
                <li class="list-li" v-for="item in items">
                    <router-link :to="{name:'detail',params:{id:item.id}}">
                        <div class="item item-top">
                            <span class="tab" :class="item.tab | getTabInfo(item.top, item.good, true)">{{item.tab | getTabInfo(item.top, item.good, false)}}</span>
                            <span class="title">{{item.title}}</span>
                        </div>
                        <div class="item item-bottom">
                            <img :src="item.author.avatar_url" alt="" onerror="this.src='../assets/img/default.png'">
                            <div class="info">
                                <div class="base-info info-style">
                                    <span class="username">{{item.author.loginname}}</span>
                                    <span class="createtime"><i class="fa fa-clock-o"></i>{{item.create_at | getTime}}</span>
                                </div>
                                <div class="other-info info-style">
                                    <span><i class="fa fa-comment-o"></i>{{item.reply_count}}</span>
                                    <span><i class="fa fa-eye"></i>{{item.visit_count}}</span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </li>
            </ul>
            <div class="load-more-container" v-if='loadMoreFlag'>
                <i class="fa fa-refresh fa-spin fa-2x"></i>
            </div>
        </section>
        <na-menu></na-menu>
        <na-back-to-top v-if='scrollY > 200' @scrollToTop='scrollY = 0'></na-back-to-top>
    </div>
</template>

<script>
    import naHead from '../components/header'
    import naMenu from '../components/menu'
    import naBackToTop from '../components/backtotop'

    export default {
        data () {
            return {
                items: [],
                searchInfo: {
                    page: 1,
                    limit: 20,
                    tab: 'all',
                    mdrender: true
                },
                scrollY: 0,
                loadMoreFlag: false
            }
        },
        mounted () {
            if (this.$route.query && this.$route.query.tab) {
                this.searchInfo.tab = this.$route.query.tab
            }
            if (window.window.sessionStorage.searchInfo && window.window.sessionStorage.tab === this.searchInfo.tab) {
                this.items = JSON.parse(window.window.sessionStorage.items)
                this.searchInfo = JSON.parse(window.window.sessionStorage.searchInfo)
                this.$nextTick(() => window.scrollTo(0, window.window.sessionStorage.scrollTop))
            } else {
                this.getTopics()
            }
            window.addEventListener('scroll', this.scroll)
        },
        beforeRouteEnter (to, from, next) {
            if (from.name !== 'detail') {
                if (window.sessionStorage.tab) {
                    window.sessionStorage.removeItem('items')
                    window.sessionStorage.removeItem('searchInfo')
                    window.sessionStorage.removeItem('tab')
                }
            }
            next()
        },
        beforeRouteLeave (to, from, next) {
            if (to.name === 'detail') {
                window.sessionStorage.scrollTop = this.scrollY
                window.sessionStorage.items = JSON.stringify(this.items)
                window.sessionStorage.searchInfo = JSON.stringify(this.searchInfo)
                window.sessionStorage.tab = from.query.tab || 'all'
            }
            next()
        },
        methods: {
            getTitleStr (tab) {
                let str = ''
                switch (tab) {
                    case 'share':
                        str = '分享'
                        break
                    case 'ask':
                        str = '问答'
                        break
                    case 'job':
                        str = '招聘'
                        break
                    case 'good':
                        str = '精华'
                        break
                    default:
                        str = '全部'
                        break
                }
                return str
            },
            getTopics () {
                this.$http.get('https://cnodejs.org/api/v1/topics', {params: this.searchInfo}).then(res => {
                    res.body.data.forEach((v, i) => {
                        this.items.push(v)
                    })
                    this.loadMoreFlag = false
                })
            },
            scroll () {
                this.scrollY = window.pageYOffset || window.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
                let section = document.getElementsByTagName('section')[0]
                if (!section) return
                if ((this.scrollY + window.innerHeight === section.clientHeight) && !this.loadMoreFlag) {
                    this.loadMoreFlag = true
                    this.searchInfo.page++
                    this.getTopics()
                }
            }
        },
        watch: {
            '$route' (to, from) {
                if (to.query && to.query.tab) {
                    this.searchInfo.tab = to.query.tab
                    this.items = []
                }
                this.searchInfo.page = 1
                this.getTopics()
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
    li-padding = 30px  /*list-li padding*/
    .list-container
        padding-top 46px
        .list-ul
            padding li-padding 30px 0
            &:before
                position fixed
                z-index -1
                top 0
                bottom 0
                left 0
                right 0
                content ''
                background #38404e
                background-image linear-gradient(rgba(255,255,255,0.2) 1px, transparent 0),linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 0)
                background-size 60px 60px
            .list-li
                display flex
                flex-wrap wrap
                justify-content left
                padding 20px 10px
                margin-top li-padding
                border-radius 0.5em
                background #465162
                box-shadow: 10px 10px 0 0 #272d37
                &:nth-child(1)
                    margin-top 0
                a
                    width 100%
                .item
                    display flex
                    flex-basis 100%
                    align-items center
                    &.item-top
                        max-width 100%
                        padding 5px 0px
                        margin-bottom 10px
                        font-size 16px
                        .tab
                            width 40px
                            padding: 5px 0;
                            margin-right 15px
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
                        .title
                            flex 1
                            overflow hidden
                            color #fff
                            font-weight bold
                            white-space nowrap
                            text-overflow ellipsis
                    &.item-bottom
                        color #cfd4db
                        img
                            width 40px
                            height 40px
                            margin-right 10px
                            border-radius 50%
                        i
                            margin-right 6px
                        .info
                            display flex
                            flex 1
                            flex-wrap wrap
                            .info-style
                                display flex
                                flex-basis 100%
                                justify-content space-between
                                &.base-info .createtime
                                    margin-right 10px
                                &.other-info
                                    margin-top 4px
                                    span
                                        margin-right 20px
        .load-more-container
            padding 10px 0
            color #fff
            text-align center        
</style>
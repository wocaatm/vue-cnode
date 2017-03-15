<template>
    <div id="index">
        <na-head :title='getTitleStr(searchKey.tab)'></na-head>
        <section class="listContainer">
            <ul>
                <li class="flexible" v-for="item in items">
                    <router-link :to="{name:'detail',params:{id:item.id}}">
                        <div class="item item-top">
                            <span class="tab" :class="item.tab | getTabInfo(item.top, item.good, true)">{{item.tab | getTabInfo(item.top, item.good, false)}}</span>
                            <span class="title">{{item.title}}</span>
                        </div>
                        <div class="item item-bottom">
                            <img :src="item.author.avatar_url" alt="">
                            <div class="info">
                                <div class="user-info common-info">
                                    <span class="username">{{item.author.loginname}}</span>
                                    <span class="createtime"><i class="fa fa-clock-o"></i>{{item.create_at | getTime}}</span>
                                </div>
                                <div class="other-info common-info">
                                    <span><i class="fa fa-comment-o"></i>{{item.reply_count}}</span>
                                    <span><i class="fa fa-eye"></i>{{item.visit_count}}</span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </li>
            </ul>
            <div class="loader-container" v-if='scrollLoader'>
                <i class="fa fa-refresh fa-spin fa-2x"></i>
            </div>
        </section>
        <na-menu></na-menu>
        <na-back-to-top v-if='showBackTop' @scrollState='changeState'></na-back-to-top>
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
                searchKey: {
                    page: 1,
                    limit: 20,
                    tab: 'all',
                    mdrender: true
                },
                isScrolling: false,
                scrollY: 0,
                scrollLoader: false
            }
        },
        computed: {
            showBackTop () {
                if (this.scrollY > 200 || this.isScrolling) {
                    return true
                } else {
                    return false
                }
            }
        },
        mounted () {
            if (this.$route.query && this.$route.query.tab) {
                this.searchKey.tab = this.$route.query.tab
            }
            if (window.window.sessionStorage.searchKey && window.window.sessionStorage.tab === this.searchKey.tab) {
                this.items = JSON.parse(window.window.sessionStorage.items)
                this.searchKey = JSON.parse(window.window.sessionStorage.searchKey)
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
                    window.sessionStorage.removeItem('searchKey')
                    window.sessionStorage.removeItem('tab')
                }
            }
            next()
        },
        beforeRouteLeave (to, from, next) {
            if (to.name === 'detail') {
                window.sessionStorage.scrollTop = this.scrollY
                window.sessionStorage.items = JSON.stringify(this.items)
                window.sessionStorage.searchKey = JSON.stringify(this.searchKey)
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
                this.$http.get('https://cnodejs.org/api/v1/topics', {params: this.searchKey}).then(res => {
                    res.body.data.forEach((v, i) => {
                        this.items.push(v)
                    })
                    this.scrollLoader = false
                })
            },
            scroll () {
                this.scrollY = window.pageYOffset || window.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
                let section = document.getElementsByTagName('section')[0]
                if (!section) return
                if ((this.scrollY + window.innerHeight === section.clientHeight) && !this.scrollLoader) {
                    this.scrollLoader = true
                    this.searchKey.page++
                    this.getTopics()
                }
            },
            changeState (arg) {
                this.isScrolling = arg[0]
            }
        },
        watch: {
            '$route' (to, from) {
                if (to.query && to.query.tab) {
                    this.searchKey.tab = to.query.tab
                    this.items = []
                }
                this.searchKey.page = 1
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
    .listContainer
        padding-top 46px
        .flexible
            display flex
            flex-wrap wrap
            justify-content left
            border-bottom 1px solid #d5dbdb
            padding 10px
            a
                width 100%
            .item
                flex-basis 100%
                display flex
                align-items center
                &.item-top
                    max-width 100%
                    font-size 16px
                    padding 5px 0px
                    .tab
                        width 40px
                        background #e74c3c
                        border-radius 4px
                        color #fff
                        padding: 5px 0;
                        margin-right 15px
                        font-size 10px
                        font-weight 400
                        text-align center
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
                        color #2c3e50
                        font-weight blod
                        overflow hidden
                        white-space nowrap
                        text-overflow ellipsis
                &.item-bottom
                    color #34495e
                    img
                        width 40px
                        height 40px
                        margin-right 10px
                        border-radius 50%
                    i
                        margin-right 6px
                    .info
                        flex 1
                        display flex
                        flex-wrap wrap
                        .common-info
                            flex-basis 100%
                            display flex
                            &.user-info
                                justify-content space-between
                                .createtime
                                    margin-right 10px
                            &.other-info
                                margin-top 4px
                                span
                                    margin-right 20px
        .loader-container
            padding 10px 0
            text-align center
            color #333
</style>
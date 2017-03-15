<template>
    <div id="about">
        <na-head title='关于'></na-head>
        <div class="about-content">
            <h3 class="about-title">关于此webapp的相关介绍</h3>
            <ul>
                <li>1:利用<a href="https://cnodejs.org/api">Cnode-API</a>来获取webapp的数据</li>
                <li>2:代码已经提交到<a href="https://github.com/wocaatm/vue-cnode">github</a>上,很感谢能给个star</li>
                <li>3:webapp利用了<a href="http://cn.vuejs.org/">vue</a>的相关技术构建</li>
            </ul>
        </div>
        <na-menu></na-menu>
    </div>
</template>

<script>
    import naHead from '../components/header'
    import naMenu from '../components/menu'
    export default {
        components: {
            naHead,
            naMenu
        }
    }
</script>

<style lang='stylus'>
    .about-content
        padding-top 46px
        .about-title
            line-height 40px
            text-align center
            font-weight normal
            text-shadow 1px 1px 2px #ccc
            border-radius 5px
            width 95%
            margin 20px auto
            border 1px solid #ccc
        ul
            padding 0px 2%
            li
                line-height 50px
        a
            color #08c
            margin 0 4px
</style>
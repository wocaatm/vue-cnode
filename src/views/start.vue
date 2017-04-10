<template>
    <div id="start-page">
        <svg version="1.1" viewbox='0 0 500 500' xmlns="http://www.w3.org/2000/svg">
            <symbol id="text">
                <text y="35%" class="text">CNode</text>
                <text y="70%" class="text">VueJs</text>
            </symbol>
            <g>
                <use xlink:href="#text" class="use-text"></use>
                <use xlink:href="#text" class="use-text"></use>
                <use xlink:href="#text" class="use-text"></use>
                <use xlink:href="#text" class="use-text"></use>
                <use xlink:href="#text" class="use-text"></use>
            </g>
        </svg>
    </div>
</template>

<script>
    export default {
        mounted () {
            let g = document.getElementsByTagName('g')[0]
            let position = g.getBBox()
            let offset = (window.innerWidth - position.width) / 2
            g.style.transform = 'translateX(' + offset + 'px)'
            setTimeout(() => {
                this.$router.push({
                    path: '/list'
                })
            }, 4000)
        }
    }
</script>

<style lang='stylus'>
    #start-page
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        background #404040
        svg
            width 100vw
            height 100vh
        .text
            font-size 100px
            font-family Arail
        .use-text
            fill none
            stroke white
            stroke-dashoffset 35%
            stroke-dasharray 0 87.5%
            stroke-width 4px
            &:nth-child(1)
                stroke #360745
                animation: animation1 3s ease-in-out forwards
            &:nth-child(2)
                stroke #D61C59
                animation: animation2 3s ease-in-out forwards
            &:nth-child(3)
                stroke #E7D84B
                animation: animation3 3s ease-in-out forwards
            &:nth-child(4)
                stroke #EFEAC5
                animation: animation4 3s ease-in-out forwards
            &:nth-child(5)
                stroke #1B8798
                animation: animation5 3s ease-in-out forwards
    @keyframes animation1
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 7%
        }
    @keyframes animation2
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 14%
        }
    @keyframes animation3
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 21%
        }
    @keyframes animation4
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 28%
        }
    @keyframes animation5
        100%{
            stroke-dasharray 7% 28%
            stroke-dashoffset 35%
        }
</style>
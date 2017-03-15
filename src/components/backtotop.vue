<template>
    <div class="back-body" ref='h'>
        <div class="back-to-top" @click='backToTop'></div>
    </div>
</template>

<script>
    export default {
        methods: {
            backToTop () {
                this.$refs.h.style.bottom = window.innerHeight + 'px'
                this.$emit('scrollState', [true])
                this.$refs.h.addEventListener('transitionend', this.scroll.bind(this))
            },
            scroll () {
                window.scrollTo(0, 0)
                this.$emit('scrollState', [false])
            }
        }
    }
</script>

<style lang='stylus'>
    h-top = 65px
    h-bottom = 25px
    top-bottom-length = 5px
    h-width = 35px
    p-bottom = 60px
    p-right = 12%
    h-color = #ff9900
    .back-bottom
        content ''
        position absolute
        border 5px solid h-color
        border-top-width h-bottom
        border-bottom-width h-bottom
        border-color h-color transparent transparent transparent
        bottom -(h-bottom * 2 + top-bottom-length)
    .back-body
        position fixed
        right p-right
        bottom p-bottom
        width h-width
        height h-top + h-bottom + top-bottom-length
        overflow hidden
        z-index 11
        transition bottom 1s cubic-bezier(.4,-0.45,.49,.26)
    .back-to-top
        position absolute
        right 0
        top 0    
        left 0
        bottom 25px
        width h-width
        height h-top
        background h-color
        border-radius 50% / 100% 100% 0 0
        &:after
            @extend .back-bottom
            left 3px
        &:before
            @extend .back-bottom
            right 3px
</style>
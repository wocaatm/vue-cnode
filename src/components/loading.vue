<template>
    <div id="loading">
        <span class="loading-icon">
            <i class="fa fa-spinner fa-pulse fa-4x"></i>
        </span>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang='stylus'>
    #loading
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        background #fff
        color #000
        z-index 7
        .loading-icon
            position absolute
            left 50%
            top 50%
            transform translate(-50%,-50%)
</style>
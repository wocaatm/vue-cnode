<template>
    <div id="menu" ref='menu' class="edge-left">
        <nav class="menu">
            <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open"/>
            <label class="menu-open-button" for="menu-open" @click.prevent='openMenu'>
                <span class="hamburger hamburger-1"></span>
                <span class="hamburger hamburger-2"></span>
                <span class="hamburger hamburger-3"></span>
            </label>
            <router-link :to="{ name: 'list', query: { tab: 'all' }}" class='menu-item'><i class="fa fa-th-large"></i></router-link>
            <router-link :to="{ name: 'list', query: { tab: 'good' }}" class='menu-item'><i class="fa fa-thumbs-o-up"></i></router-link>
            <router-link :to="{ name: 'list', query: { tab: 'share' }}" class='menu-item'><i class="fa fa-share-alt"></i></router-link>
            <router-link :to="{ name: 'list', query: { tab: 'ask' }}" class='menu-item'><i class="fa fa-question"></i></router-link>
            <router-link :to="{ name: 'list', query: { tab: 'job' }}" class='menu-item'><i class="fa fa-users"></i></router-link>
            <router-link :to="{ name: 'about'}" class='menu-item'><i class="fa fa-bell"></i></router-link>
        </nav>
    </div>
</template>

<script>
    import Intertia from '../libs/inertia'
    export default {
        data () {
            return {
                ele: ''
            }
        },
        mounted () {
            if (window.localStorage.Inertia_menu) {
                let ele = document.getElementById('menu')
                let strStoreDistance = window.localStorage['Inertia_' + ele.id].split(',')
                if (strStoreDistance[0] > (window.innerWidth / 2)) {
                    ele.classList.remove('edge-left')
                    ele.classList.add('edge-right')
                } else {
                    ele.classList.remove('edge-right')
                    ele.classList.add('edge-left')
                }
            }
            this.ele = this.$refs.menu
            Intertia(this.ele)
        },
        methods: {
            openMenu () {
                let checkbox = this.ele.querySelectorAll("input[type='checkbox']")[0]
                if (!checkbox.classList.contains('no-move')) {
                    checkbox.checked = !checkbox.checked
                }
            }
        }
    }
</script>

<style lang='stylus'>
    $fg = #e91e63
    $pi = 3.1415
    $menu-items = 6
    $open-distance = 60px
    $opening-angle = $pi + 1.572
    $hamburger-spacing = 6px
    .ball
        background $fg
        border-radius 50%
        width 40px
        height 40px
        position absolute
        color white
        text-align center
        line-height 40px
        transform translate3d(0,0,0)
        transition transform ease-out 200ms
        z-index 9
    #menu 
        position fixed
        width 40px
        height 40px
        left 23px
        top 80%
        font-size 20px
        color #fff
        margin-left -22px
        margin-top -22px
        z-index 999
        .menu
            width 44px
            height 44px
            .menu-open
                display none
            .menu-open:checked + .menu-open-button
                transition-timing-function linear
                transition-duration 200ms
                transform scale(0.8,0.8) translate3d(0,0,0)
                .hamburger-1
                    transform translate3d(0,0,0) rotate(45deg)
                .hamburger-2
                    transform translate3d(0,0,0) scale(0.1,1)
                .hamburger-3
                    transform translate3d(0,0,0) rotate(-45deg)
            .menu-open-button
                @extend .ball
                z-index 100
                transition-timing-function cubic-bezier(0.175, 0.885, 0.320, 1.275)
                transition-duration 400ms
                .hamburger
                    width 20px
                    height 3px
                    background #fff
                    display block
                    position absolute
                    top 50%
                    left 50%
                    margin-left -10px
                    margin-top -1.5px
                    transition tranform 200ms
                    &.hamburger-1
                        transform translate3d(0,- $hamburger-spacing,0)
                    &.hamburger-2
                        transform translate3d(0,0,0)
                    &.hamburger-3
                        transform translate3d(0,$hamburger-spacing,0)
            .menu-item
                @extend .ball
                for nth in $menu-items
                    &:nth-child({nth+2})
                        transition-duration: 180ms
            .menu-open:checked ~ .menu-item
                transition-timing-function cubic-bezier(0.935, 0, 0.34, 1.33)
                &:nth-child(3)
                    transition-duration 160ms
                &:nth-child(4)
                    transition-duration 240ms
                &:nth-child(5)
                    transition-duration 320ms
                &:nth-child(6)
                    transition-duration 400ms
                &:nth-child(7)
                    transition-duration 480ms
                &:nth-child(8)
                    transition-duration 560ms
        &.edge-left
            .menu-open:checked ~ .menu-item
                &:nth-child(3)
                    transform translate3d(-0.09629px, -79.99994px, 0)
                &:nth-child(4)
                    transform translate3d(46.92425px, -64.79286px, 0)
                &:nth-child(5)
                    transform translate3d(76.03889px, -24.86137px, 0)
                &:nth-child(6)
                    transform translate3d(76.13772px, 24.55702px, 0)
                &:nth-child(7)
                    transform translate3d(47.18304px, 64.60465px, 0)
                &:nth-child(8)
                    transform translate3d(0.22371px, 79.99969px, 0)
        &.edge-right
            .menu-open:checked ~ .menu-item
                &:nth-child(3)
                    transform translate3d(-0.09629px, -79.99994px, 0)
                &:nth-child(4)
                    transform translate3d(-47.08009px, -64.67971px, 0)
                &:nth-child(5)
                    transform translate3d(-76.09852px, -24.67825px, 0)
                &:nth-child(6)
                    transform translate3d(-76.07839px, 24.74023px, 0)
                &:nth-child(7)
                    transform translate3d(-47.02738px, 64.71805px, 0)
                &:nth-child(8)
                    transform translate3d(-0.03112px, 79.99999px, 0)
</style>
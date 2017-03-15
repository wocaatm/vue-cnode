var Inertia = function (ele, options) {
    var defaults = {
        edge: true
    }
    var params = {}
    options = options || {}
    for (var key in defaults) {
        if (typeof options[key] !== 'undefined') {
            params[key] = options[key]
        } else {
            params[key] = defaults[key]
        }
    }
    var data = {
        distanceX: 0,
        distanceY: 0
    }
    var checkbox = ele.querySelectorAll("input[type='checkbox']")[0]
    var win = window
    var winWidth = win.innerWidth
    var winHeight = win.innerHeight
    if (!ele) {
        return
    }
    var fnTranslate = function (x, y) {
        x = Math.round(1000 * x) / 1000
        y = Math.round(1000 * y) / 1000
        ele.style.webkitTransform = 'translate(' + [x + 'px', y + 'px'].join(',') + ')'
        ele.style.transform = 'translate3d(' + [x + 'px', y + 'px', 0].join(',') + ')'
    }
    var strStoreDistance = ''
    if (ele.id && win.localStorage && (strStoreDistance = localStorage['Inertia_' + ele.id])) {
        var arrStoreDistance = strStoreDistance.split(',')
        ele.distanceX = +arrStoreDistance[0]
        ele.distanceY = +arrStoreDistance[1]
        fnTranslate(ele.distanceX, ele.distanceY)
    }
    ele.style.visibility = 'visible'
    var initBound = ele.getBoundingClientRect()
    if (initBound.left < -0.5 * initBound.width ||
        initBound.top < -0.5 * initBound.height ||
        initBound.right > winWidth + 0.5 * initBound.width ||
        initBound.bottom > winHeight + 0.5 * initBound.height
        ) {
        ele.distanceX = 0
        ele.distanceY = 0
        fnTranslate(0, 0)
    }
    ele.addEventListener('touchstart', function (event) {
        var events = event.touches[0] || event
        data.posX = events.pageX
        data.posY = events.pageY
        data.touching = true
        data.flag = !checkbox.checked
        if (ele.distanceX) {
            data.distanceX = ele.distanceX
        }
        if (ele.distanceY) {
            data.distanceY = ele.distanceY
        }
        data.bound = ele.getBoundingClientRect()
        data.timerready = true
    })
    var easeOutBounce = function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
        }
    }
    document.addEventListener('touchmove', function (event) {
        if (data.touching !== true || !data.flag) {
            return
        }
        if (data.timerready === true) {
            data.timerstart = +new Date()
            data.timerready = false
        }
        checkbox.classList.add('no-move')
        event.preventDefault()
        var events = event.touches[0] || event
        data.nowX = events.pageX
        data.nowY = events.pageY
        var distanceX = data.nowX - data.posX
        var distanceY = data.nowY - data.posY
        var absLeft = data.bound.left + distanceX
        var absTop = data.bound.top + distanceY
        var absRight = absLeft + data.bound.width
        var absBottom = absTop + data.bound.height
        if (absLeft < 0) {
            distanceX = distanceX - absLeft
        }
        if (absTop < 0) {
            distanceY = distanceY - absTop
        }
        if (absRight > winWidth) {
            distanceX = distanceX - (absRight - winWidth)
        }
        if (absBottom > winHeight) {
            distanceY = distanceY - (absBottom - winHeight)
        }
        var x = data.distanceX + distanceX
        var y = data.distanceY + distanceY
        fnTranslate(x, y)
        ele.distanceX = x
        ele.distanceY = y
    })

    document.addEventListener('touchend', function () {
        if (data.touching === false) {
            return
        }
        data.touching = false
        data.timerend = +new Date()
        if (!data.nowX || !data.nowY) {
            return
        }
        var distanceX = data.nowX - data.posX
        var distanceY = data.nowY - data.posY
        if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
            return
        }
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        var time = data.timerend - data.timerstart
        var speed = distance / time * 16.666
        var rate = Math.min(10, speed)
        data.inertiaing = true
        var reverseX = 1
        var reverseY = 1
        var step = function () {
            if (data.touching === true) {
                data.inertiaing = false
                return
            }
            speed = speed - speed / rate
            var moveX = reverseX * speed * distanceX / distance
            var moveY = reverseY * speed * distanceY / distance
            var bound = ele.getBoundingClientRect()
            if (moveX < 0 && bound.left + moveX < 0) {
                moveX = 0 - bound.left
                reverseX = reverseX * -1
            } else if (moveX > 0 && bound.right + moveX > winWidth) {
                moveX = winWidth - bound.right
                reverseX = reverseX * -1
            }
            if (moveY < 0 && bound.top + moveY < 0) {
                moveY = -1 * bound.top
                reverseY = -1 * reverseY
            } else if (moveY > 0 && bound.bottom + moveY > winHeight) {
                moveY = winHeight - bound.bottom
                reverseY = -1 * reverseY
            }
            var x = ele.distanceX + moveX
            var y = ele.distanceY + moveY
            fnTranslate(x, y)
            ele.distanceX = x
            ele.distanceY = y
            if (speed < 0.1) {
                speed = 0
                if (params.edge === false) {
                    data.inertiaing = false
                    checkbox.classList.remove('no-move')
                    if (win.localStorage) {
                        localStorage['Inertia_' + ele.id] = [x, y].join()
                    }
                } else {
                    edge()
                }
            } else {
                requestAnimationFrame(step)
            }
        }
        var edge = function () {
            var start = 0
            var during = 25
            var init = ele.distanceX
            var y = ele.distanceY
            var change = 0
            var bound = ele.getBoundingClientRect()
            if (bound.left + bound.width / 2 < winWidth / 2) {
                change = -1 * bound.left
                ele.classList.remove('edge-right')
                ele.classList.add('edge-left')
            } else {
                change = winWidth - bound.right
                ele.classList.remove('edge-left')
                ele.classList.add('edge-right')
            }
            var run = function () {
                if (data.touching === true) {
                    data.inertiaing = false
                    return
                }
                start++
                var x = easeOutBounce(start, init, change, during)
                fnTranslate(x, y)
                if (start < during) {
                    requestAnimationFrame(run)
                } else {
                    ele.distanceX = x
                    ele.distanceY = y
                    data.inertiaing = false
                    checkbox.classList.remove('no-move')
                    if (win.localStorage) {
                        localStorage['Inertia_' + ele.id] = [x, y].join()
                    }
                }
            }
            run()
        }
        step()
    })
}

export default Inertia
exports.getTabInfo = (tab, top, good, isClassName) => {
    let str = ''
    let className = ''
    if (top) {
        str = '置顶'
        className = 'top'
    } else if (good) {
        str = '精华'
        className = 'good'
    } else {
        switch (tab) {
            case 'share':
                str = '分享'
                className = 'share'
                break
            case 'ask':
                str = '问答'
                className = 'ask'
                break
            case 'job':
                str = '招聘'
                className = 'job'
                break
            default:
                str = '暂无'
                className = 'no-type'
                break
        }
    }
    return isClassName ? className : str
}

exports.getTime = (value) => {
    let index = value.indexOf('T')
    return value.substr(0, index)
}
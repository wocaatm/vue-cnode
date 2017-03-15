import Vue from 'vue'

export default {
    install () {
        let time = null
        Vue.prototype.$alert = (msg, showTime = 2000) => {
            let exist = document.getElementsByClassName('alertContainer')
            if (exist.length) {
                document.body.removeChild(exist[0])
            }
            let container = document.createElement('div')
            container.classList.add('alertContainer')
            container.innerHTML = msg
            document.body.appendChild(container)
            clearTimeout(time)
            time = window.setTimeout(() => {
                document.body.removeChild(container)
            }, showTime)
        }
    }
}
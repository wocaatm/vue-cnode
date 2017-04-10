import Vue from 'vue'

export default {
    install () {
        let time = null
        Vue.prototype.$alert = (msg, showTime = 2000) => {
            let exist = document.getElementsByClassName('alert-container')
            if (exist.length) {
                document.body.removeChild(exist[0])
            }
            let container = document.createElement('div')
            container.classList.add('alert-container')
            container.innerHTML = msg
            document.body.appendChild(container)
            clearTimeout(time)
            time = window.setTimeout(() => {
                document.body.removeChild(container)
            }, showTime)
        }
    }
}
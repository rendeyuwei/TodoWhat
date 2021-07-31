import Vue from 'vue'
import Taro from '@tarojs/taro'

const app = {
    mounted() {
        if (process.env.TARO_ENV === 'weapp') {
            Taro.cloud.init({
                env: 'todo-0g1y2w1328063c98',
                traceUser: true
            })
        }
    },
    onShow(options) {
        console.log('app onshow', options)
    },
    render(h) {
        return h('div', this.$slots.default)
    }
}

export default app

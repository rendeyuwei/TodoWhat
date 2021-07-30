import Vue from 'vue'

const app = {
  onShow (options) {
    console.log('app onshow', options)
  },
  render(h) {
    return h('div', this.$slots.default)
  }
}

export default app

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import { Table as OriTable, Button as OriButton, Input as OriInput } from 'origami-vue'
import 'virtual:svg-icons-register'
import '@/assets/styles/reset.less'

if (window.__POWERED_BY_WUJIE__) {
  document.body.setAttribute('data-wujie', 'true')
}

let instance = null

function render() {
  instance = createApp(App)
  instance.use(store).use(router).use(OriTable).use(OriButton).use(OriInput).mount('#app')
}

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = render
  window.__WUJIE_UNMOUNT = () => {
    instance?.unmount()
    instance = null
  }
  window.__WUJIE?.mount()
} else {
  render()
}

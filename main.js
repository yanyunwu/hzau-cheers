import App from './App'


// #ifndef VUE3
import Vue from 'vue'
import store from './store'
import request from '@/utils/request'
Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { log } from 'async'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
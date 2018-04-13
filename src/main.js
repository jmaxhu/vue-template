import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.less'

import App from './App.vue'
import router from './router/index'
import store from './store/index'

import Waves from '@/directive/waves'
import * as filters from './filters' // global filters

Vue.use(ElementUI)
Vue.use(Waves)

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

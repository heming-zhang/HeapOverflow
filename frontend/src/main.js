// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSession from 'vue-session'

Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.use(SuiVue)
Vue.use(VueSession)
axios.defaults.withCredentials = true

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import Vuex from 'vuex'
// import env from '@/conf/env'
// import createLogger from 'vuex/dist/logger'
import global from './module/global'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global
  }
//   strict: env.debug,
//   plugins: env.debug ? [createLogger()] : []
})

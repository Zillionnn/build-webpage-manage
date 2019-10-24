import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/page-config/:id',
      name: 'PageConfig',
      component: () => import('@/components/pages/PageConfig.vue')
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
// import Index from 'components/index'

Vue.use(Router)
Vue.use(VueResource)
Vue.config.debug = true
export default new Router({
  routes: [
    {
      path: '/luckwheel',
      name: 'luckwheel',
      component: resolve => require(['../components/luckWheel'], resolve)
    }
  ]
})

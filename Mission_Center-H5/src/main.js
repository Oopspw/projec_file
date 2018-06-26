// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './vuex/store'
import xmlHttp from 'common/xmlhttp'
import VueLazyload from 'vue-lazyload'
import MintUI from 'mint-ui'
Vue.use(Vuex)
Vue.use(xmlHttp)
Vue.use(MintUI)
Vue.use(VueLazyload, {
  preLoad: 1,    // 预加载高度的比例
  error: 'http://img5.duitang.com/uploads/item/201509/25/20150925110719_HtTCj.jpeg',  // 图像的src加载失败
  // loading: '../static/img/logo.png', // src的图像加载
  loading: 'http://img5.duitang.com/uploads/item/201509/25/20150925110719_HtTCj.jpeg', // src的图像加载
  attempt: 1,  // 尝试计数
  listenEvents: [ 'scroll', 'mousewheel' ] // 你想要监听的事件,我个人喜欢全部监听，方便

})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

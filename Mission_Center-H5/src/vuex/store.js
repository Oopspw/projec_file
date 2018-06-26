import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    remember: true
  },
  mutations: {
    remember (state, msg) {
      state.remember = msg
    }
  }
})
export default store

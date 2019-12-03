import Vue from 'vue'
import Vuex from 'vuex'
import { debug } from 'util';

Vue.use(Vuex)

const common = {
  namespaced: true,
  state: {
    //左侧菜单状态
    isCollapse: false,
    platform:'',
    user:{
      userName:''
    },
    annualUser:{
      code:'',
      area:'',
      email:'',
      isOrdered:true,
      name:'',
      phone:'',
      province:''
    },
    power:{},
    promotion:{}//促销主题对象
  },
  mutations:{
    setPlatform (state, platform) {
      state.platform = platform
    },
    setPower (state, power) {
      state.power = power
    },
    setAnnualUser (state, annualUser) {
      state.annualUser = annualUser
    },
    setUser (state, user) {
      state.user = user
    },
    setPormotion(state,promotion){
      state.promotion = promotion
    }
  },
  actions:{},
  getters:{}
}

const store = new Vuex.Store({
  modules: {
    common: common
  }
})

export {store}

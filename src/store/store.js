import Vue from 'vue'
import Vuex from 'vuex'

import demoModules from '../modules/demoModule.js'//demo

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
   
    demo: demoModules, //demo

    

  },
  state: {
    //存储数据
    getMenuItems_bb: {},
    getMenuItems_otc: {},
    getMenuItems_hd: {},
    getMenuItems_hy: {},
    getSearch_coin: {},
    getSort: {},
    getDiscount: {},
    getNum: {},
    getOtcList: {},
    assetdata: {},
    getcoin_type: {}

  },
  getters: {
    //获取属性的状态
  },
  mutations: {
    //改变属性的状态
    getMenuItems_bb(state, data) {
      state.getMenuItems_bb = data;
    },
    getMenuItems_otc(state, data) {
      state.getMenuItems_otc = data;
    },
    getMenuItems_hd(state, data) {
      state.getMenuItems_hd = data;
    },
    getMenuItems_hy(state, data) {
      state.getMenuItems_hy = data;
    },
    getSearch_coin(state, data) {
      state.getSearch_coin = data;
    },
    getSort(state, data) {
      state.getSort = data;
    },
    getDiscount(state, data) {
      state.getDiscount = data;
    },
    getNum(state, data) {
      state.getNum = data;
    },
    getOtcList(state, data) {
      state.getOtcList = data;
    },
    assetdata(state, data) {
      state.assetdata = data;
    },
    getcoin_type(state, data) {
      state.coin_type = data;
    }
    //
  },
  actions: {
    //应用mutations
  }
})
export default store
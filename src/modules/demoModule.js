import Vue from 'vue';

/*types*/
const types = {
  INCREASE: 'increase',//增加
  REQUEST_ACTION: 'requestAction'//请求
}

/*states*/
const state = {
  count: 0,
  res: {
    msg: '',
  }
}

/*mutations*/
const mutations = {
  [types.INCREASE](state, data) {
    state.count++
  },
  [types.REQUEST_ACTION](state, data) {
    state.res = data;
  },
}

/*actions*/
const actions = {
  actionIncrease: function ({ commit, state }) {
    commit(types.INCREASE)
  },
  requestAction: function ({ commit, state }, params) {
    //请求
    getJavaRequest(params).then((res) => {
      console.log('res', res);
      if (res.status != 200) {

      } else {
        commit(types.REQUEST_ACTION, res);
       
        router.push({ path: '/demo' });
      }
    }).catch(() => {
    });
  }
}

/*getters*/
const getters = {
  count: function (state) {
    return state.count += 100;
  }
}

export default {
  state,
  mutations,
  actions,
  //getters
}
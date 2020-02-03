/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    timeLineData: [],
    provinceData: {}
  },
  mutations: {
    setTimeLineData: (state, timeLineData) => {
      state.timeLineData = timeLineData
    },
    setProvinceData: (state, provinceData) => {
      state.provinceData = provinceData
    }
  }
})
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import app from './app'
import permission from './permission'
import org from './org'
import getters from './getters'
import account from './account'
import district from './district'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    org,
    account,
    district
  },
  getters
})

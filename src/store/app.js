import appTypes from './types/app'

const state = {
  title: '基于 Vue, ElementUI 的后台模板',
  sidebar: {
    opened: true
  }
}

const actions = {
  [appTypes.TOGGLE_SIDEBAR] ({commit}) {
    commit(appTypes.TOGGLE_SIDEBAR)
  }
}

const mutations = {
  [appTypes.TOGGLE_SIDEBAR] (state) {
    state.sidebar.opened = !state.sidebar.opened
  }
}

export default {
  state,
  actions,
  mutations
}

import appTypes from './types/app'

const state = {
  title: '基于 Vue, ElementUI 的脚手架',
  sidebar: {
    opened: true
  },
  currentBreadcrumb: null,
  otherBreadcrumb: {}
}

const actions = {
  [appTypes.TOGGLE_SIDEBAR] ({commit}) {
    commit(appTypes.TOGGLE_SIDEBAR)
  },
  [appTypes.SET_BREADCRUMB] ({commit}, {type, route}) {
    commit(appTypes.SET_BREADCRUMB, {type, route})
  },
  [appTypes.CLEAR_BREADCRUMB] ({commit}) {
    commit(appTypes.CLEAR_BREADCRUMB)
  }
}

const mutations = {
  [appTypes.TOGGLE_SIDEBAR] (state) {
    state.sidebar.opened = !state.sidebar.opened
  },
  [appTypes.SET_BREADCRUMB] (state, {type, route}) {
    state.currentBreadcrumb = type
    state.otherBreadcrumb[type] = route
  },
  [appTypes.CLEAR_BREADCRUMB] (state) {
    state.currentBreadcrumb = null
  }
}

export default {
  state,
  actions,
  mutations
}

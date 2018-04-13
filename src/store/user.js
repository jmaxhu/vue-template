import userService from '@/api/user'
import { setToken, setUser, getUserId, setUserId, clearAuth } from '@/utils/auth'
import userTypes from './types/user'

const state = {
  token: '',
  roles: [],
  userId: '',
  user: null
}

const actions = {
  [userTypes.LOGIN] ({commit}, {userName, password}) {
    return new Promise((resolve, reject) => {
      userService.login({userName, password}).then(res => {
        const data = res.data
        commit('SET_TOKEN', data)
        setToken(data.bearerToken)
        setUserId(data.userId)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  [userTypes.GET_USER_INFO] ({commit}) {
    const userId = getUserId()
    return new Promise((resolve, reject) => {
      userService.getUserInfo(userId).then(res => {
        const user = res.data
        commit('SET_USER', user)
        setUser(user)
        resolve(user)
      }).catch(err => reject(err))
    })
  },
  [userTypes.LOGOUT] ({commit}) {
    return new Promise((resolve, reject) => {
      userService.logout().then(() => {
        commit('LOGOUT')
        resolve()
      }).catch(err => reject(err))
    })
  },
  /**
   * 查询用户列表
   */
  [userTypes.GET_USERS] ({commit}, {
    searchName = '',
    organizationId = '',
    role = '',
    valid = true,
    pageIndex = 1,
    pageSize = 20
  }) {
    return new Promise((resolve, reject) => {
      userService.getUsers({searchName, organizationId, role, valid, pageIndex, pageSize}).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 新增或保存一个用户
   */
  [userTypes.SAVE_USER] ({commit}, user) {
    return new Promise((resolve, reject) => {
      userService.saveUser(user).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 删除一个用户
   */
  [userTypes.DELETE_USER] ({commit}, id) {
    return new Promise((resolve, reject) => {
      userService.deleteUser(id).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  }
}

const mutations = {
  SET_TOKEN (state, authInfo) {
    state.token = authInfo.bearerToken
    state.userId = authInfo.userId
  },
  SET_USER (state, user) {
    state.user = user
    state.roles = [user.role]
  },
  LOGOUT (state) {
    state.user = null
    state.roles = []
    state.token = ''
    state.userId = ''
    clearAuth()
  }
}

export default {
  state,
  actions,
  mutations
}

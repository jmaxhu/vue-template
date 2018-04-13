import { constantRouterMap, asyncRouterMap } from '@/router/routerMap'
import permTypes from './types/permission'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
  })
  return accessedRouters
}

const state = {
  routers: constantRouterMap,
  addRouters: []
}

const actions = {
  [permTypes.GEN_ROUTES] ({commit}, data) {
    return new Promise((resolve) => {
      const { roles } = data
      let accessedRouters
      if (roles.indexOf('admin') !== -1) {
        accessedRouters = asyncRouterMap
      } else {
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
      }
      commit(permTypes.SET_ROUTES, accessedRouters)
      resolve()
    })
  }
}

const mutations = {
  [permTypes.SET_ROUTES] (state, routers) {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  }
}

export default {
  state,
  actions,
  mutations
}

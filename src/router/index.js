import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from '@/utils/auth'
import userTypes from '@/store/types/user'
import permTypes from '@/store/types/permission'
import store from '@/store/index'
import { constantRouterMap } from './routerMap'

Vue.use(Router)

NProgress.configure({ showSpinner: false })

const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const whiteList = ['/login', '/authredirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  console.log(`before: from:${from.path}, to:${to.path}`)
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      NProgress.done()
      next()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch(userTypes.GET_USER_INFO).then(user => { // 拉取user_info
          const roles = [user.role]
          // 根据roles权限生成可访问的路由表
          store.dispatch(permTypes.GEN_ROUTES, { roles }).then(() => {
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch((err) => {
          console.log(err)
          store.dispatch(userTypes.LOGOUT).then(() => {
            Message.error('请重新登录')
            next({ path: '/login' })
          })
        })
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => {
  console.log('after')
  NProgress.done()
})

export default router

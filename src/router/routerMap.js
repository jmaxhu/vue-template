import Layout from '../views/layout/index.vue'

const _import = require(`./_import_${process.env.NODE_ENV}`)

/**
  * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
  * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
  *                                if not set alwaysShow, only more than one route under the children
  *                                it will becomes nested mode, otherwise not show the root menu
  * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
  * name:'router-name'             the name is used by <keep-alive> (must set!!!)
  * meta : {
      roles: ['admin','editor']     will control the page roles (you can set multiple roles)
      title: 'title'               the name show in submenu and breadcrumb (recommend set)
      icon: 'svg-name'             the icon show in the sidebar,
      noCache: true                if true ,the page will no be cached(default is false)
    }
 */
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('error/404'), hidden: true },
  { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'fa-home', noCache: true }
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/org',
    component: Layout,
    redirct: '/org/index',
    meta: { roles: ['admin'] },
    children: [{
      path: 'index',
      component: _import('org/index'),
      name: 'org',
      meta: {
        title: '组织管理',
        icon: 'fa-sitemap',
        roles: ['admin']
      }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirct: '/user/index',
    meta: { roles: ['admin'] },
    children: [{
      path: 'index',
      component: _import('user/index'),
      name: 'user',
      meta: {
        title: '用户管理',
        icon: 'fa-user',
        roles: ['admin']
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

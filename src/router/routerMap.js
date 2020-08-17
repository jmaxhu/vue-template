import Layout from '../views/layout/index.vue'
import AdminLayout from '../views/layout/admin.vue'

const _import = file => resolve => require(['@/views/' + file + '.vue'], resolve)

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
    hidden: true,
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: '/home',
      component: _import('home/index'),
      name: 'home',
      meta: { title: '首页', icon: 'fa-home', noCache: true }
    }]
  },
  {
    path: '/dashboard',
    component: AdminLayout,
    redirct: '/dashboard/index',
    children: [{
      path: 'index',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'fa-home', noCache: true }
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      title: '系统管理',
      icon: 'fa-cog'
    },
    children: [
      {
        path: 'district',
        component: _import('district/index'),
        name: 'admin_district',
        meta: {
          title: '行政区划',
          icon: 'fa-chart-area',
          roles: ['admin']
        }
      },
      {
        path: 'org',
        component: _import('org/index'),
        name: 'admin_org',
        meta: {
          title: '组织管理',
          icon: 'fa-sitemap',
          roles: ['admin']
        }
      },
      {
        path: 'permission',
        component: _import('permission/index'),
        name: 'admin_permission',
        meta: {
          title: '权限管理',
          icon: 'fa-cogs',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        component: _import('role/index'),
        name: 'admin_role',
        meta: {
          title: '角色管理',
          icon: 'fa-user-tag'
        }
      },
      {
        path: 'user',
        component: _import('user/index'),
        name: 'admin_user',
        meta: {
          title: '用户管理',
          icon: 'fa-user',
          roles: ['admin']
        }
      }
    ]
  },
  {
    hidden: true,
    path: '/permission',
    component: AdminLayout,
    redirct: '/permission/index',
    children: [{
      path: 'index/:appKey',
      component: _import('permission/index'),
      name: 'permission',
      meta: {
        icon: 'fa-cogs',
        title: '权限管理'
      }
    },
    {
      path: 'edit/:id',
      component: _import('permission/edit'),
      name: 'permission_edit',
      meta: {
        icon: 'fa-cogs',
        title: '权限维护'
      }
    }]
  },
  {
    hidden: true,
    path: '/info',
    component: Layout,
    meta: {
      title: '组织管理',
      icon: 'fa-sitemap'
    },
    redirct: '/info/index',
    children: [{
      path: 'index',
      component: _import('info/index'),
      name: 'info',
      meta: {
        title: '工程概况',
        icon: 'fa-user'
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

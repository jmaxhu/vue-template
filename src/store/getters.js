export default {
  title: state => state.app.title,
  token: state => state.user.token,
  sidebar: state => state.app.sidebar,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  // 组织树
  orgTree: state => state.org.orgTree,
  orgTreeList: state => state.org.orgTreeList,
  // 额外的 Breadcrumb
  otherBreadcrumb: state => state.app.currentBreadcrumb ? state.app.otherBreadcrumb[state.app.currentBreadcrumb] : null
}

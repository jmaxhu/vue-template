import request from '@/utils/request'

export default {
  getRoleGroups (params) {
    return request.get('/account/role_group', { params })
  },
  saveRoleGroup (roleGroup) {
    return request.post('/account/role_group', roleGroup)
  },
  deleteRoleGroup (id) {
    return request.delete('/account/role_group', { data: { id } })
  },
  getRoles (params) {
    return request.get('/account/roles', { params })
  },
  saveRole (role) {
    return request.post('/account/role', role)
  },
  deleteRole (id) {
    return request.delete('/account/role', { data: { id } })
  },
  assignRoles (userId, roleIds) {
    return request.post('/account/assign_role', { userId, roleIds })
  },
  getPermissionGroups (params) {
    return request.get('/account/permission_group', { params })
  },
  savePermissionGroup (permissionGroup) {
    return request.post('/account/permission_group', permissionGroup)
  },
  deletePermissionGroup (id) {
    return request.delete('/account/permission_group', { data: { id } })
  },
  getPermissions (params) {
    return request.get('/account/permission', { params })
  },
  savePermission (permission) {
    return request.post('/account/permission', permission)
  },
  deletePermission (id) {
    return request.delete('/account/permission', { data: { id } })
  }
}

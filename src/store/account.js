import types from './types/account'
import accountService from '@/api/account'

function genGroupTree (node, data) {
  for (let child of data.children) {
    child.data.key = `k_${child.data.id}`
    let newNode = Object.assign({ children: [] }, child.data)
    if (child.data.permissions && child.data.permissions.length > 0) {
      newNode.children = child.data.permissions.map(x => ({ ...x, type: 'permission', key: x.id }))
      newNode.permissions = null
    }
    if (child.data.roles && child.data.roles.length > 0) {
      newNode.children = child.data.roles.map(x => ({ ...x, type: 'role', key: x.id }))
      newNode.roles = null
    }
    node.children.push(newNode)
    genGroupTree(newNode, child)
  }
}

const state = {}

const actions = {
  /**
   * 得到角色分组列表
   */
  [types.GET_ROLEGROUPS] ({ commit }, { withRoles = false }) {
    return new Promise((resolve, reject) => {
      accountService.getRoleGroups({ withRoles }).then(res => {
        let data = res.data
        if (!data) resolve(data)
        let root = Object.assign({ children: [] }, data.data)
        genGroupTree(root, data)
        resolve([root])
      }).catch(err => reject(err))
    })
  },
  /**
   * 保存一个角色分组
   */
  [types.SAVE_ROLEGROUP] (_, roleGroup) {
    return new Promise((resolve, reject) => {
      accountService.saveRoleGroup(roleGroup).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 删除一个角色分组
   */
  [types.DELETE_ROLEGROUP] (_, { id }) {
    return new Promise((resolve, reject) => {
      accountService.deleteRoleGroup(id).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 根据条件得到角色列表
   */
  [types.GET_ROLES] ({ commit }, { roleGroupId, searchName }) {
    return new Promise((resolve, reject) => {
      accountService.getRoles({ roleGroupId, searchName }).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 新增或修改一个角色
   */
  [types.SAVE_ROLE] ({ commit }, role) {
    return new Promise((resolve, reject) => {
      accountService.saveRole(role).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 删除一个角色
   */
  [types.DELETE_ROLE] ({ commit }, { id }) {
    return new Promise((resolve, reject) => {
      accountService.deleteRole(id).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 给用户分配角色
   */
  [types.ASSIGN_ROLES] (_, { userId, roleIds }) {
    return new Promise((resolve, reject) => {
      accountService.assignRoles(userId, roleIds).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 根据条件得到权限分组列表
   */
  [types.GET_PERMISSIONGROUPS] ({ commit }, { withPermission = false }) {
    return new Promise((resolve, reject) => {
      accountService.getPermissionGroups({ withPermission }).then(res => {
        let data = res.data
        if (!data) resolve(data)
        let root = Object.assign({ children: [] }, data.data)
        genGroupTree(root, data)
        resolve([root])
      }).catch(err => reject(err))
    })
  },
  /**
   * 保存一个权限分组
   */
  [types.SAVE_PERMISSIONGROUP] ({ commit }, permissionGroup) {
    return new Promise((resolve, reject) => {
      accountService.savePermissionGroup(permissionGroup).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 删除一个权限分组
   */
  [types.DELETE_PERMISSIONGROUP] ({ commit }, { id }) {
    return new Promise((resolve, reject) => {
      accountService.deletePermissionGroup(id).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 根据条件得到权限列表
   */
  [types.GET_PERMISSIONS] ({ commit }, params) {
    return new Promise((resolve, reject) => {
      accountService.getPermissions(params).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 保存一个权限项
   */
  [types.SAVE_PERMISSION] ({ commit }, permission) {
    return new Promise((resolve, reject) => {
      accountService.savePermission(permission).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 删除一个权限项
   */
  [types.DELETE_PERMISSION] ({ commit }, { id }) {
    return new Promise((resolve, reject) => {
      accountService.deletePermission(id).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  }
}

const mutations = {}

export default {
  state,
  actions,
  mutations
}

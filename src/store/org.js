import orgTypes from './types/org'
import orgService from '@/api/org'

// 生成树结构
function genOrgTree (orgs) {
  let orgTree = []
  if (!orgs || orgs.length === 0) {
    return orgTree
  }
  const rootOrgs = orgs.filter(x => x.parentId === 0).sort((a, b) => a.id - b.id)
  if (rootOrgs.length === 0) {
    return orgTree
  }
  rootOrgs.forEach(root => {
    let parentNode = { id: root.id, label: root.name, children: [] }
    orgs.filter(x => x.parentId === root.id).forEach(org => {
      parentNode.children.push({ id: org.id, label: org.name })
    })
    orgTree.push(parentNode)
  })
  return orgTree
}

// 生成简化的树结构
function genOrgTreeList (orgs) {
  let orgList = []
  if (!orgs || orgs.length === 0) {
    return orgList
  }
  const rootOrgs = orgs.filter(x => x.parentId === 0).sort((a, b) => a.id - b.id)
  if (rootOrgs.length === 0) {
    return orgList
  }
  rootOrgs.forEach(root => {
    orgList.push({ label: root.name, value: root.id })
    orgs.filter(x => x.parentId === root.id).forEach(org => {
      orgList.push({ label: `⊢${org.name}`, value: org.id })
    })
  })
  return orgList
}

const state = {
  orgTree: [], // 组织树，可以按树控件方式展示
  orgTreeList: [] // 组织树以简化方式展示
}

const actions = {
  /**
   * 分页查询组织列表
   */
  [orgTypes.GET_ORGS] ({commit}, { parentId = '', searchName = '', pageIndex = 1, pageSize = 20 }) {
    return new Promise((resolve, reject) => {
      orgService.getOrgs({ parentId, searchName, pageIndex, pageSize }).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 新增或编辑一个组织
   */
  [orgTypes.SAVE_ORG] ({commit}, org) {
    return new Promise((resolve, reject) => {
      orgService.saveOrg(org).then(res => {
        commit('CLEAR_ORG_TREE')
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 删除一个组织
   */
  [orgTypes.DELETE_ORG] ({commit}, id) {
    return new Promise((resolve, reject) => {
      orgService.deleteOrg(id).then(res => {
        commit('CLEAR_ORG_TREE')
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  /**
   * 得到根组织
   */
  [orgTypes.GET_ROOT_ORGS] ({commit}) {
    return new Promise((resolve, reject) => {
      orgService.getRootOrgs().then(res => {
        resolve(res.data.results)
      }).catch(err => reject(err))
    })
  },
  /**
   * 生成组织树
   */
  [orgTypes.GET_ORG_TREE] ({state, commit}) {
    return new Promise((resolve, reject) => {
      if (state.orgTree.length > 0) {
        resolve({orgTree: state.orgTree, orgTreeList: state.orgTreeList})
      } else {
        // 取全部组织, 最多1000, 如果再多时考虑使用延迟加载方式
        orgService.getOrgs({ pageIndex: 1, pageSize: 1000 }).then(res => {
          const orgs = res.data.results
          // 生成树结构
          const orgTree = genOrgTree(orgs)
          const orgTreeList = genOrgTreeList(orgs)
          commit('SET_ORG_TREE', { orgTree, orgTreeList })
          resolve({ orgTree, orgTreeList })
        }).catch(err => reject(err))
      }
    })
  }
}

const mutations = {
  SET_ORG_TREE (state, { orgTree, orgTreeList }) {
    state.orgTree = orgTree
    state.orgTreeList = orgTreeList
  },
  CLEAR_ORG_TREE (state) {
    state.orgTree = []
    state.orgTreeList = []
  }
}

export default {
  state,
  actions,
  mutations
}

import request from '@/utils/request'

export default {
  getOrgs (params) {
    return request.get('/org', { params })
  },
  saveOrg (org) {
    return request.post('/org', org)
  },
  deleteOrg (id) {
    return request.delete('/org', { data: { id } })
  },
  getRootOrgs () {
    return request.get('/org', {
      params: {
        parentId: 0,
        pageIndex: 1,
        pageSize: 100
      }
    })
  }
}

import request from '@/utils/request'

export default {
  login ({ userName, password }) {
    return request.post('/auth/credentials', { userName, password })
  },
  getUserInfo (id) {
    return request.get('/account/user', { params: { id } })
  },
  logout () {
    return request.post('/auth/logout')
  },
  getUsers (params) {
    return request.get('/account/users', { params })
  },
  saveUser (user) {
    return request.post('/account/user', user)
  },
  deleteUser (id) {
    return request.delete('/account/user', { data: { id } })
  }
}

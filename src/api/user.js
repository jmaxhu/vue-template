import request from '@/utils/request'

export default {
  login ({userName, password}) {
    return request.get('/auth/credentials', { params: { userName, password } })
  },
  getUserInfo (id) {
    return request.get(`/user/${id}`)
  },
  logout () {
    return request.post('/auth/logout')
  },
  getUsers (params) {
    return request.get('/user', { params })
  },
  saveUser (user) {
    return request.post('/user', user)
  },
  deleteUser (id) {
    return request.delete('/user', { data: { id } })
  }
}

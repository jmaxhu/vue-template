import request from '@/utils/request'

export default {
  getDistricts (params) {
    return request.get('/account/districts', { params })
  },
  getDistrictById (id) {
    return request.get('/account/district', { params: { id } })
  },
  getDistrictByCode (code) {
    return request.get('/account/district_by_code', { params: { code } })
  },
  saveDistrict (district) {
    return request.post('/account/district', district)
  },
  deleteDistrict (id) {
    return request.delete('/account/district', { data: { id } })
  }
}

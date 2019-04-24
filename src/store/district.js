import districtService from '../api/district'
import types from './types/district'

const state = {}

const actions = {
  [types.GET_DISTRICTS] (_, { parentId = 0 }) {
    return new Promise((resolve, reject) => {
      districtService.getDistricts({ parentId }).then(res => {
        resolve(res.data)
      }).catch((err) => reject(err))
    })
  },
  [types.GET_DISTRICT_BYID] (_, { id }) {
    return new Promise((resolve, reject) => {
      districtService.getDistrictById(id).then(res => {
        resolve(res.data)
      }).catch((err) => reject(err))
    })
  },
  [types.GET_DISTRICT_BYCODE] (_, { code }) {
    return new Promise((resolve, reject) => {
      districtService.getDistrictByCode(code).then(res => {
        resolve(res.data)
      }).catch((err) => reject(err))
    })
  },
  [types.SAVE_DISTRICT] (_, district) {
    return new Promise((resolve, reject) => {
      districtService.saveDistrict(district).then(res => {
        resolve(res.data)
      }).catch((err) => reject(err))
    })
  },
  [types.DELETE_DISTRICT] (_, { id }) {
    return new Promise((resolve, reject) => {
      districtService.deleteDistrict(id).then(res => {
        resolve(res.data)
      }).catch((err) => reject(err))
    })
  }
}

const mutations = {}

export default {
  state,
  actions,
  mutations
}

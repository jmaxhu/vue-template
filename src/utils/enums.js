/**
 * 角色
 */
export const Roles = [
  { name: '系统管理员', value: 'admin' },
  { name: '数据操作员', value: 'operator' },
  { name: '数据观察员', value: 'watcher' }
]

/**
 * 行政区划类型
 */
export const DistrictType = [
  { name: '省级行政区', value: 'Provincial' },
  { name: '地级行政区', value: 'Prefecture' },
  { name: '县级行政区', value: 'Country' },
  { name: '乡级行政区', value: 'Township' },
  { name: '村级行政区', value: 'Village' },
  { name: '其它', value: 'Other' }
]

/**
 * 根据枚举类型和给定的值得到描述
 * @param {array} enumType 枚举类型
 * @param {string|number} value 枚举项的值
 */
export const getEnumText = function (enumType, value) {
  if (!enumType || !value) return ''
  if (!Array.isArray(enumType)) {
    throw new Error('枚举类型必须是数组。')
  }
  let items = enumType.filter(x => x.value === value)
  return items.length > 0 ? items[0].name : ''
}

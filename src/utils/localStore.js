/**
 * 用于浏览器保存的帮助方法
 */

export default {
  /**
   * 根据key得到序列化后的数据
   * @param {string} key 键名
   * @param {boolen} needParse 默认值
   */
  getItem (key, needParse = true) {
    const item = window.localStorage.getItem(key)
    if (!item) return null
    return needParse ? JSON.parse(item) : item
  },
  /**
   * 根据键，值对保存到本地
   * @param {stirng} key 键名
   * @param {object} data 保存数据
   */
  setItem (key, data) {
    const dataStr = typeof (data) === 'string' ? data : JSON.stringify(data)
    window.localStorage.setItem(key, dataStr)
  },
  /**
   * 根据键删除存储项
   */
  removeItem (key) {
    window.localStorage.removeItem(key)
  }
}

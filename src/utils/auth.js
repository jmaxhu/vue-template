/**
 * 用户登录相关
 */
import store from './localStore'

const UserKey = 'auth_user'
const UserIdKey = 'auth_user_id'
const TokenKey = 'auth_token'
const HomeKey = 'home_path'

export function isAuthenticated () {
  return !!store.getItem(UserKey)
}

export function getUserId () {
  return store.getItem(UserIdKey, false)
}

export function setUserId (userId) {
  store.setItem(UserIdKey, userId)
}

export function setUser (user) {
  store.setItem(UserKey, user)
  // store.setItem(Token, user.bearerToken)
}

export function getUser () {
  return store.getItem(UserKey)
}

export function getToken () {
  return store.getItem(TokenKey, false)
}

export function setToken (token) {
  store.setItem(TokenKey, token)
}

export function clearAuth () {
  store.removeItem(UserKey)
  store.removeItem(TokenKey)
  store.removeItem(HomeKey)
  store.removeItem(UserIdKey)
}

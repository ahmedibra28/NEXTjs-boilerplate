import { customLocalStorage } from './customLocalStorage'

export const UnlockAccess = (roles) => {
  return roles.includes(
    customLocalStorage() &&
      customLocalStorage().userInfo &&
      customLocalStorage().userInfo.group
  )
}

export const Access = {
  admin: ['admin'],
  user: ['user'],
  adminUser: ['admin', 'user'],
}

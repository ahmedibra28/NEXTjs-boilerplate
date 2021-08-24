import localStorageInfo from './localStorageInfo'

export const UnlockAccess = (roles) => {
  return roles.includes(localStorageInfo() && localStorageInfo().group)
}

export const Access = {
  admin: ['admin'],
  user: ['user'],
  adminUser: ['admin', 'user'],
}

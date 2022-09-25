export const userInfo = () => {
  return {
    userInfo:
      typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(
            typeof window !== 'undefined' && localStorage.getItem('userInfo')
          )
        : null,
  }
}

export const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo()?.userInfo?.token}`,
    },
  }
}

export const UnlockAccess = (roles: string[]) => {
  return roles.includes(userInfo()?.userInfo?.group)
}

export const Access = {
  admin: ['admin'],
  user: ['user'],
  adminUser: ['admin', 'user'],
}

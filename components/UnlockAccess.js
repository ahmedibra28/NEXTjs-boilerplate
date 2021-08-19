import localStorageInfo from '../utils/localStorageInfo'

export const UnlockAccess = (role) => {
  const group = 'admin'
  return group === role && true
}

export const UnlockAccessRoute = (role) => {
  const group = localStorageInfo() && localStorageInfo().group.split(' ')

  let willReturn = []
  let i, j
  for (i in group) {
    for (j in role) {
      willReturn.push(role[j] === group[i])
    }
  }

  return willReturn.includes(true)
}

const localStorageInfo = () => {
  return typeof window !== 'undefined' && localStorage.getItem('userInfo')
    ? JSON.parse(
        typeof window !== 'undefined' && localStorage.getItem('userInfo')
      )
    : null
}

export const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorageInfo() && `Bearer ${localStorageInfo().token}`,
    },
  }
}

export default localStorageInfo

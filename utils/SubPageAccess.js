import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { customLocalStorage } from './customLocalStorage'

const SubPageAccess = () => {
  const router = useRouter()

  const group = customLocalStorage() && customLocalStorage().userInfo

  return useEffect(() => {
    if (!group || (group && group.group !== 'admin')) {
      router.push('/')
    }
  }, [router, group])
}

export default SubPageAccess

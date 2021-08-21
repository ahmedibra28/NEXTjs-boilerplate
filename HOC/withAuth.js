import { useRouter } from 'next/router'
import localStorageInfo from '../utils/localStorageInfo'

const withAuth = async (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const pathName = router.asPath
      const accessToken = localStorageInfo() && localStorageInfo().token

      if (
        localStorage.getItem('userRoutes') &&
        !JSON.parse(localStorage.getItem('userRoutes')).includes(pathName)
      ) {
        router.push('/')
        return null
      }

      if (!accessToken) {
        router.push('/login')
        return null
      }

      return <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth

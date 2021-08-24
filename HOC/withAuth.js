import { useRouter } from 'next/router'
import { customLocalStorage } from '../utils/customLocalStorage'

const withAuth = async (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const pathName = router.asPath
      const accessToken =
        customLocalStorage() &&
        customLocalStorage().userInfo &&
        customLocalStorage().userInfo.token

      if (
        customLocalStorage() &&
        customLocalStorage().userAccessRoutes &&
        !customLocalStorage()
          .userAccessRoutes.route.map((g) => g.path)
          .includes(pathName)
      ) {
        router.push('/')
        return null
      }

      if (!accessToken) {
        router.push(`/login?next=${pathName}`)
        return null
      }

      return <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth

import { useRouter } from 'next/router'
import { customLocalStorage } from '../utils/customLocalStorage'

const withAuth = async (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const pathName = router.pathname
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
        router.isReady &&
          router.push(`/login?next=${router.isReady && router.asPath}`)

        return null
      }

      return <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth

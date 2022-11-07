import { useRouter } from 'next/router'
import { userInfo } from '../api/api'

const withAuth = async (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const pathName = router.pathname
      const accessToken =
        userInfo() && userInfo().userInfo && userInfo().userInfo.token

      if (
        userInfo() &&
        userInfo().userInfo &&
        !userInfo()
          .userInfo.routes.map((g) => g.path)
          .includes(pathName)
      ) {
        router.push('/')
        return null
      }

      if (!accessToken) {
        router.isReady &&
          router.push(`/auth/login?next=${router.isReady && router.asPath}`)

        return null
      }

      return <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth

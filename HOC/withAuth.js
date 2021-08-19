import axios from 'axios'
import { useRouter } from 'next/router'
import localStorageInfo, { config } from '../utils/localStorageInfo'

const getGroups = async () => {
  try {
    const { data } = await axios.get(`/api/admin/groups`, config())

    return data
  } catch (error) {
    throw error.response.data
  }
}

const withAuth = async (WrappedComponent) => {
  const groupData = await getGroups()

  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const pathName = router.asPath
      const accessToken = localStorageInfo() && localStorageInfo().token
      const role = localStorageInfo() && localStorageInfo().group

      const authRoutes =
        groupData && groupData.filter((r) => r.name === role && r.route)[0]

      const authPath = authRoutes && authRoutes.route.map((g) => g.path)

      console.log(authPath)

      if (authPath && !authPath.includes(pathName)) {
        router.push('/')
        return null
      }

      if (!accessToken) {
        router.push('/login')
        authRoutes = null
        authPath = null
        return null
      }

      return <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth

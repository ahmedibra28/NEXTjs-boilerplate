import { useRouter } from 'next/router'

const withAuth = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()
      const accessToken = localStorage.getItem('userInfo')

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

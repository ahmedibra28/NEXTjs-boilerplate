import dynamicAPI from './dynamicAPI'
import { useMutation, useQueryClient } from 'react-query'

const url = '/api/auth'

export default function useAuthHook() {
  const queryClient = useQueryClient()

  const postLogin = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/login`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['login']),
    }
  )

  const postLogout = () => {
    typeof window !== undefined && localStorage.removeItem('userRole')
    return typeof window !== undefined && localStorage.removeItem('userInfo')
  }

  const postForgotPassword = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/forgot-password`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['forgot password']),
    }
  )

  const postResetPassword = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/reset-password`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['reset password']),
    }
  )

  return { postLogin, postLogout, postForgotPassword, postResetPassword }
}

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import useAuthHook from '../../utils/api/auth'
import useUserRolesHook from '../../utils/api/userRoles'
import { customLocalStorage } from '../../utils/customLocalStorage'
import Head from 'next/head'
import { inputEmail, inputPassword } from '../../utils/dynamicForm'

const Login = () => {
  const router = useRouter()
  const pathName = router.query.next || '/'
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { postLogin } = useAuthHook()
  const { postUserRoleById } = useUserRolesHook({
    page: 1,
    q: '',
    limit: 10000000,
  })

  const { isLoading, isError, error, mutateAsync, isSuccess, data } = postLogin
  const {
    mutateAsync: userRoleMutateAsync,
    data: userRole,
    error: errorUserRole,
    isError: isErrorUserRole,
  } = postUserRoleById

  useEffect(() => {
    if (isSuccess) {
      userRoleMutateAsync(data._id)
      if (userRole) {
        typeof window !== undefined &&
          localStorage.setItem('userRole', JSON.stringify(userRole))

        typeof window !== undefined &&
          localStorage.setItem('userInfo', JSON.stringify(data))
        router.push(pathName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, userRole])

  useEffect(() => {
    customLocalStorage() && customLocalStorage().userInfo && router.push('/')
  }, [router])

  const submitHandler = async (data) => {
    mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Login</title>
        <meta property='og:title' content='Login' key='title' />
      </Head>
      <h3 className='fw-light font-monospace text-center'>Sign In</h3>
      {isError && <Message variant='danger'>{error}</Message>}
      {isErrorUserRole && <Message variant='danger'>{errorUserRole}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputEmail({
          register,
          errors,
          label: 'Email',
          name: 'email',
          placeholder: 'Email',
        })}
        {inputPassword({
          register,
          errors,
          label: 'Password',
          name: 'password',
          placeholder: 'Password',
        })}
        <button
          type='submit'
          className='btn btn-primary form-control '
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      <div className='row pt-3'>
        <div className='col'>
          <Link href='/auth/forgot-password'>
            <a className='ps-1 text-decoration-none'> Forgot Password?</a>
          </Link>
        </div>
      </div>
    </FormContainer>
  )
}

export default Login

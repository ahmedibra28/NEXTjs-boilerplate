import { useEffect } from 'react'
import { FormContainer, Message } from '../../../components'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { customLocalStorage } from '../../../utils/customLocalStorage'
import Head from 'next/head'
import { inputPassword } from '../../../utils/dynamicForm'
import useAuthHook from '../../../utils/api/auth'
const Reset = () => {
  const { postResetPassword } = useAuthHook()
  const router = useRouter()
  const { resetToken } = router.query

  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admin: false,
      user: false,
    },
  })

  const { isLoading, isError, error, isSuccess, mutateAsync } =
    postResetPassword

  useEffect(() => {
    if (isSuccess) {
      resetForm()
      router.push('/auth/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    customLocalStorage() && customLocalStorage().userInfo && router.push('/')
  }, [router])

  const submitHandler = (data) => {
    const password = data.password
    mutateAsync({ password, resetToken })
  }

  return (
    <FormContainer>
      <Head>
        <title>Reset</title>
        <meta property='og:title' content='Reset' key='title' />
      </Head>
      <h3 className=''>Reset Password</h3>
      {isSuccess && (
        <Message variant='success'>Password Updated Successfully</Message>
      )}

      {isError && <Message variant='danger'>{error}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputPassword({
          register,
          errors,
          label: 'Password',
          name: 'password',
          minLength: true,
          isRequired: true,
          placeholder: 'Password',
        })}

        {inputPassword({
          register,
          errors,
          watch,
          name: 'confirmPassword',
          label: 'Confirm Password',
          validate: true,
          minLength: true,
          placeholder: 'Confirm Password',
        })}

        <button
          type='submit'
          className='btn btn-primary form-control'
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Change'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default Reset

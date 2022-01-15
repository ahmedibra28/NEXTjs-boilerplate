import { useEffect } from 'react'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { customLocalStorage } from '../utils/customLocalStorage'
import Head from 'next/head'
import { inputEmail } from '../utils/dynamicForm'
import useUsers from '../api/users'

const Forgot = () => {
  const { forgot } = useUsers()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { isLoading, isError, error, isSuccess, mutateAsync } = forgot

  useEffect(() => {
    isSuccess && reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    customLocalStorage() && customLocalStorage().userInfo && router.push('/')
  }, [router])

  const submitHandler = (data) => {
    mutateAsync(data)
  }
  return (
    <FormContainer>
      <Head>
        <title>Forgot</title>
        <meta property='og:title' content='Forgot' key='title' />
      </Head>
      <h3 className='fw-light font-monospace text-center'>Forgot Password</h3>
      {isSuccess && (
        <Message variant='success'>
          An email has been sent with further instructions.
        </Message>
      )}
      {isError && <Message variant='danger'>{error}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputEmail({ register, errors, label: 'Email', name: 'email' })}

        <button
          type='submit'
          className='btn btn-primary form-control '
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Send'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default Forgot

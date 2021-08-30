import { useEffect } from 'react'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { forgot } from '../api/users'
import { useMutation } from 'react-query'
import { customLocalStorage } from '../utils/customLocalStorage'
import Head from 'next/head'
import { inputEmail } from '../utils/dynamicForm'

const Forgot = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { isLoading, isError, error, isSuccess, mutateAsync } = useMutation(
    'forgot',
    forgot,
    {
      retry: 0,
      onSuccess: () => {
        reset()
      },
    }
  )

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
      <h3 className=''>Forgot Password</h3>
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

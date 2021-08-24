import { useEffect } from 'react'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { forgot } from '../api/users'
import { useMutation } from 'react-query'
import { customLocalStorage } from '../utils/customLocalStorage'
import Head from 'next/head'

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
        <div className='mb-3'>
          <label htmlFor='email'>Email Address</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.+\S+/,
                message: 'Entered value does not match email format',
              },
            })}
            type='email'
            placeholder='Enter email'
            className='form-control'
            autoFocus
          />
          {errors.email && (
            <span className='text-danger'>{errors.email.message}</span>
          )}
        </div>

        <button
          type='submit'
          className='btn btn-primary  '
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

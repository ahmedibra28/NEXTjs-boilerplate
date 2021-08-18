import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

import { registerUser } from '../api/users'
import { useMutation } from 'react-query'

import { useForm } from 'react-hook-form'
import localStorageInfo from '../utils/localStorageInfo'
import Head from 'next/head'

const Register = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admin: false,
      user: false,
    },
  })

  const { isLoading, isError, error, isSuccess, mutateAsync } = useMutation(
    'registerUser',
    registerUser,
    {
      retry: 0,
      onSuccess: () => {
        reset()
        router.push('/')
      },
    }
  )

  useEffect(() => {
    localStorageInfo() && router.push('/')
  }, [router])

  const submitHandler = (data) => {
    mutateAsync(data)
  }
  return (
    <FormContainer>
      <Head>
        <title>Sign up</title>
        <meta property='og:title' content='Signup' key='title' />
      </Head>
      <h3 className=''>Sign Up</h3>
      {isSuccess && (
        <Message variant='success'>User has registered successfully</Message>
      )}

      {isError && <Message variant='danger'>{error}</Message>}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='mb-3'>
          <label htmlFor='name'>Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type='text'
            placeholder='Enter name'
            className='form-control'
            autoFocus
          />
          {errors.name && (
            <span className='text-danger'>{errors.name.message}</span>
          )}
        </div>
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
          />
          {errors.email && (
            <span className='text-danger'>{errors.email.message}</span>
          )}
        </div>
        <div className='mb-3'>
          <label htmlFor='password'>Password</label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must have at least 6 characters',
              },
            })}
            type='password'
            placeholder='Enter password'
            className='form-control'
          />
          {errors.password && (
            <span className='text-danger'>{errors.password.message}</span>
          )}
        </div>
        <div className='mb-3'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              minLength: {
                value: 6,
                message: 'Password must have at least 6 characters',
              },
              validate: (value) =>
                value === watch().password || 'The passwords do not match',
            })}
            type='password'
            placeholder='Confirm password'
            className='form-control'
          />
          {errors.confirmPassword && (
            <span className='text-danger'>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <button type='submit' className='btn btn-primary ' disabled={isLoading}>
          {isLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className='row py-3'>
        <div className='col'>
          Have an Account?
          <Link href='/login'>
            <a className='ps-1'>Login </a>
          </Link>
        </div>
      </div>
    </FormContainer>
  )
}

export default Register

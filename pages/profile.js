import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import FormContainer from '../components/FormContainer'
import { useForm } from 'react-hook-form'

import { getUserDetails, updateUserProfile } from '../api/users'
import { useQuery, useMutation } from 'react-query'
import localStorageInfo from '../utils/localStorageInfo'
import Head from 'next/head'

const Profile = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const { data, isLoading, isError, error } = useQuery(
    ['userDetails', localStorageInfo() && localStorageInfo()._id],
    () => getUserDetails(localStorageInfo() && localStorageInfo()._id),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateProfile,
    isError: isErrorUpdateProfile,
    error: errorUpdateProfile,
    isSuccess,
    mutateAsync,
  } = useMutation(
    ['updateProfile', localStorageInfo() && localStorageInfo()._id],
    updateUserProfile,
    {
      retry: 0,
      onSuccess: () => {
        setValue('password', '')
        setValue('confirmPassword', '')
      },
    }
  )

  useEffect(() => {
    setValue('name', !isLoading ? data && data.name : '')
    setValue('email', !isLoading ? data && data.email : '')
  }, [isLoading, setValue, data])

  const submitHandler = (data) => {
    mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Profile</title>
        <meta property='og:title' content='Profile' key='title' />
      </Head>
      <h3 className=''>User Profile</h3>
      {isErrorUpdateProfile && (
        <Message variant='danger'>{errorUpdateProfile}</Message>
      )}
      {isError && <Message variant='danger'>{error}</Message>}
      {isSuccess && (
        <Message variant='success'>User has been updated successfully</Message>
      )}
      {isLoading && (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      )}
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
        <button
          type='submit'
          className='btn btn-primary  '
          disabled={isLoadingUpdateProfile}
        >
          {isLoadingUpdateProfile ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Profile)), { ssr: false })

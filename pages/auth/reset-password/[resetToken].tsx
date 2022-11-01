import React, { useEffect } from 'react'
import { FormContainer, Message } from '../../../components'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { userInfo } from '../../../utils/helper'
import Head from 'next/head'
import { inputPassword } from '../../../utils/dynamicForm'
import apiHook from '../../../api'

const Reset = () => {
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

  const postApi = apiHook({
    key: ['reset-password'],
    method: 'POST',
    url: `auth/reset-password`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      resetForm()
      router.push('/auth/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo() && userInfo().userInfo && router.push('/')
  }, [router])

  const submitHandler = (data) => {
    const password = data.password
    postApi?.mutateAsync({ password, resetToken })
  }

  return (
    <FormContainer>
      <Head>
        <title>Reset</title>
        <meta property='og:title' content='Reset' key='title' />
      </Head>
      <h3 className=''>Reset Password</h3>
      {postApi?.isSuccess && (
        <Message variant='success'>Password Updated Successfully</Message>
      )}

      {postApi?.isError && <Message variant='danger'>{postApi?.error}</Message>}

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
          disabled={postApi?.isLoading}
        >
          {postApi?.isLoading ? (
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

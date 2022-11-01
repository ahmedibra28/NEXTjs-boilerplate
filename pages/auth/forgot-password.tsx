import React, { useEffect } from 'react'
import { FormContainer, Message } from '../../components'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { userInfo } from '../../utils/helper'
import Head from 'next/head'
import { inputEmail } from '../../utils/dynamicForm'
import apiHook from '../../api'

const Forgot = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['forgot-password'],
    method: 'POST',
    url: `auth/forgot-password`,
  })?.post

  useEffect(() => {
    postApi?.isSuccess && reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo() && userInfo().userInfo && router.push('/')
  }, [router])

  const submitHandler = (data) => {
    postApi?.mutateAsync(data)
  }
  return (
    <FormContainer>
      <Head>
        <title>Forgot</title>
        <meta property='og:title' content='Forgot' key='title' />
      </Head>
      <h3 className='fw-light font-monospace text-center'>Forgot Password</h3>
      {postApi?.isSuccess && (
        <Message variant='success'>
          An email has been sent with further instructions.
        </Message>
      )}
      {postApi?.isError && <Message variant='danger'>{postApi?.error}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputEmail({
          register,
          errors,
          label: 'Email',
          name: 'email',
          placeholder: 'Email',
        })}

        <button
          type='submit'
          className='btn btn-primary form-control '
          disabled={postApi?.isLoading}
        >
          {postApi?.isLoading ? (
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

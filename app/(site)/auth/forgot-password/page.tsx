'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'
import { CustomSubmitButton, InputEmail } from '@/components/dForms'

const Page = () => {
  const router = useRouter()
  const { userInfo } = useUserInfoStore((state) => state)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const postApi = useApi({
    key: ['forgot-password'],
    method: 'POST',
    url: `auth/forgot-password`,
  })?.post

  useEffect(() => {
    postApi?.isSuccess && reset()
  }, [postApi?.isSuccess, reset])

  useEffect(() => {
    userInfo.id && router.push('/')
  }, [router, userInfo.id])

  const submitHandler = (data: { email?: string }) => {
    postApi?.mutateAsync(data)
  }
  return (
    <FormContainer title='Forgot Password'>
      <Head>
        <title>Forgot</title>
        <meta property='og:title' content='Forgot' key='title' />
      </Head>
      {postApi?.isSuccess && (
        <Message variant='success' value={postApi?.data?.message} />
      )}
      {postApi?.isError && <Message variant='error' value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        <InputEmail
          register={register}
          errors={errors}
          label='Email'
          name='email'
          placeholder='Email'
        />

        <CustomSubmitButton isLoading={postApi?.isPending} label='Send' />
      </form>
    </FormContainer>
  )
}

export default Page

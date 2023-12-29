'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'
import { FormButton, FormInput } from '@/components/ui/Form'

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
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)} className='space-y-2'>
        <FormInput
          register={register}
          errors={errors}
          name='email'
          label='Email'
          placeholder='Email'
          type='email'
        />
        <FormButton
          loading={postApi?.isPending}
          label='Send'
          className='w-full'
        />
      </form>
    </FormContainer>
  )
}

export default Page

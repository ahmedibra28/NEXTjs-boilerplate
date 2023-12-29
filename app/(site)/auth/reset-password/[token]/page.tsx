'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'
import { useRouter } from 'next/navigation'
import { FormButton, FormInput } from '@/components/ui/Form'

const Reset = ({
  params,
}: {
  params: {
    token: string
  }
}) => {
  const router = useRouter()
  const { token } = params
  const { userInfo } = useUserInfoStore((state) => state)

  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const postApi = useApi({
    key: ['reset-password'],
    method: 'POST',
    url: `auth/reset-password`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      resetForm()
      router.push('/auth/login')
    }
  }, [postApi?.isSuccess, resetForm, router])

  useEffect(() => {
    userInfo.id && router.push('/')
  }, [router, userInfo.id])

  const submitHandler = (data: { password?: string; token?: string }) => {
    const password = data.password
    postApi?.mutateAsync({ password, resetToken: token })
  }

  return (
    <FormContainer title='Reset Password'>
      <Head>
        <title>Reset</title>
        <meta property='og:title' content='Reset' key='title' />
      </Head>
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}

      {postApi?.isError && <Message value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)} className='space-y-2'>
        <FormInput
          register={register}
          minLength={6}
          errors={errors}
          name='password'
          label='Password'
          placeholder='Password'
          type='password'
        />
        <FormInput
          register={register}
          errors={errors}
          watch={watch}
          validate={true}
          minLength={6}
          name='confirmPassword'
          label='Confirm Password'
          placeholder='Confirm Password'
          type='password'
        />

        <FormButton
          loading={postApi?.isPending}
          label='Reset Password'
          className='w-full'
        />
      </form>
    </FormContainer>
  )
}

export default Reset

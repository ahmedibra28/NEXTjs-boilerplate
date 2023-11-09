'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'
import { CustomSubmitButton, InputPassword } from '@/components/dForms'
import { useRouter } from 'next/navigation'

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
      {postApi?.isSuccess && (
        <Message variant='success' value={postApi?.data?.message} />
      )}

      {postApi?.isError && <Message variant='error' value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        <InputPassword
          register={register}
          errors={errors}
          label='Password'
          name='password'
          minLength={true}
          placeholder='Password'
        />

        <InputPassword
          register={register}
          errors={errors}
          label='Confirm Password'
          name='confirmPassword'
          watch={watch}
          validate={true}
          minLength={true}
          placeholder='Confirm Password'
        />

        <CustomSubmitButton
          label='Reset Password'
          isLoading={postApi?.isPending}
        />
      </form>
    </FormContainer>
  )
}

export default Reset

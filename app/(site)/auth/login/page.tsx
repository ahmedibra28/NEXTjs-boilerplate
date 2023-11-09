'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  CustomSubmitButton,
  InputEmail,
  InputPassword,
} from '@/components/dForms'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'

const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const postApi = useApi({
    key: ['login'],
    method: 'POST',
    url: `auth/login`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      const { id, email, menu, routes, token, name, mobile, role, image } =
        postApi.data
      updateUserInfo({
        id,
        email,
        menu,
        routes,
        token,
        name,
        mobile,
        role,
        image,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  const submitHandler = async (data: { email?: string; password?: string }) => {
    postApi?.mutateAsync(data)
  }

  return (
    <FormContainer title='Sign In'>
      {postApi?.isError && <Message variant='error' value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        <InputEmail
          errors={errors}
          register={register}
          label='Email'
          name='email'
          placeholder='Email'
        />

        <InputPassword
          errors={errors}
          register={register}
          label='Password'
          name='password'
          placeholder='Password'
        />

        <CustomSubmitButton isLoading={postApi?.isPending} label='Sign In' />
      </form>
      <div className='row pt-3'>
        <div className='col'>
          <Link
            href='/auth/forgot-password'
            className='ps-1 text-decoration-none'
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </FormContainer>
  )
}

export default Page

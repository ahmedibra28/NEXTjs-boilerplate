'use client'
import React, { useEffect, use } from 'react';
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import ApiCall from '@/services/api'

const Reset = (
  props: {
    params: Promise<{
      token: string
    }>
  }
) => {
  const params = use(props.params);
  const router = useRouter()
  const { token } = params
  const { userInfo } = useUserInfoStore((state) => state)

  const postApi = ApiCall({
    key: ['reset-password'],
    method: 'POST',
    url: `auth/reset-password`,
  })?.post

  const FormSchema = z
    .object({
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password do not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const password = values.password
    postApi?.mutateAsync({ password, resetToken: token })
  }

  useEffect(() => {
    if (postApi?.isSuccess) {
      form.reset()
      router.push('/auth/login')
    }
    // eslint-disable-next-line
  }, [postApi?.isSuccess, form.reset, router])

  useEffect(() => {
    userInfo.id && router.push('/')
  }, [router, userInfo.id])

  return (
    <FormContainer title='Reset Password'>
      <Head>
        <title>Reset</title>
        <meta property='og:title' content='Reset' key='title' />
      </Head>
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}

      {postApi?.isError && <Message value={postApi?.error} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <CustomFormField
            form={form}
            name='password'
            label='Password'
            placeholder='Enter password'
            type='password'
          />

          <CustomFormField
            form={form}
            name='confirmPassword'
            label='Confirm Password'
            placeholder='Enter confirm password'
            type='password'
          />

          <FormButton
            loading={postApi?.isPending}
            label='Reset Password'
            className='w-full'
          />
        </form>
      </Form>
    </FormContainer>
  )
}

export default Reset

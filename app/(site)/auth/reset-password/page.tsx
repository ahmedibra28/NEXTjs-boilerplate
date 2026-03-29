'use client'

import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useUserInfoStore from '@/zustand/userStore'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import { authClient } from '@/lib/auth-client'

const FormSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  })

const ResetPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const error = searchParams.get('error')
  const { userInfo } = useUserInfoStore((state) => state)
  const [message, setMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (userInfo.id) {
      router.push('/')
    }
  }, [router, userInfo.id])

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (!token) {
      setMessage('Reset token is missing or invalid')
      return
    }

    setLoading(true)
    setMessage('')
    setSuccess(false)

    const result = await authClient.resetPassword({
      newPassword: values.password,
      token,
    })

    if (result.error) {
      setLoading(false)
      setMessage(result.error.message || 'Unable to reset password')
      return
    }

    setSuccess(true)
    setLoading(false)
    form.reset()
    setTimeout(() => router.push('/auth/login'), 1500)
  }

  return (
    <FormContainer title='Reset Password'>
      <Head>
        <title>Reset</title>
        <meta property='og:title' content='Reset' key='title' />
      </Head>

      {error && <Message value='Reset link is invalid or expired' />}
      {message && <Message value={message} />}
      {success && <Message value='Password has been reset successfully' />}

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
            loading={loading}
            label='Reset Password'
            className='w-full'
            disabled={!token}
          />
        </form>
      </Form>
    </FormContainer>
  )
}

export default ResetPasswordPage

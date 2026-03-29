'use client'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import useUserInfoStore from '@/zustand/userStore'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import { authClient } from '@/lib/auth-client'

const FormSchema = z
  .object({
    name: z.string().refine((value) => value !== '', {
      message: 'Name is required',
    }),
    email: z.string().email(),
    password: z.string().refine((val) => val.length > 7, {
      message: "Password can't be less than 8 characters",
    }),
    confirmPassword: z.string().refine((val) => val.length > 7, {
      message: "Confirm password can't be less than 8 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  })

const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo } = useUserInfoStore((state) => state)

  const [message, setMessage] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true)
    setMessage('')
    setSuccess(false)

    const result = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: `${window.location.origin}/auth/verification`,
    })

    if (result.error) {
      setLoading(false)
      setMessage(result.error.message || 'Unable to sign up')
      return
    }

    form.reset()
    setSuccess(true)
    setLoading(false)
  }

  return (
    <FormContainer title='Sign Up'>
      {message && <Message value={message} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <CustomFormField
            form={form}
            name='name'
            label='Name'
            placeholder='Name'
            type='text'
          />
          <CustomFormField
            form={form}
            name='email'
            label='Email'
            placeholder='Enter email'
          />
          <CustomFormField
            form={form}
            name='password'
            label='Password'
            placeholder='Password'
            type='password'
          />
          <CustomFormField
            form={form}
            name='confirmPassword'
            label='Confirm Password'
            placeholder='Confirm password'
            type='password'
          />

          <FormButton
            loading={loading}
            label='Sign Up'
            className='w-full'
          />
          <FormButton
            label='Sign In'
            className='w-full'
            type='button'
            variant='outline'
            onClick={() => router.push('/auth/login')}
          />
        </form>
      </Form>

      {success && (
        <div className='text-green-500 text-center mt-5'>
          Please check your email to verify your account
        </div>
      )}
    </FormContainer>
  )
}

export default Page

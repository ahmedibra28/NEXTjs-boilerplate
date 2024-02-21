'use client'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/ui/CustomForm'

const FormSchema = z
  .object({
    name: z.string().refine((value) => value !== '', {
      message: 'Name is required',
    }),
    email: z.string().email(),
    password: z.string().refine((val) => val.length > 6, {
      message: "Password can't be less than 6 characters",
    }),
    confirmPassword: z.string().refine((val) => val.length > 6, {
      message: "Confirm password can't be less than 6 characters",
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

  const postApi = useApi({
    key: ['register'],
    method: 'POST',
    url: `auth/register`,
  })?.post

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  useEffect(() => {
    if (postApi?.isSuccess) {
      form.reset()
    }
    // eslint-disable-next-line
  }, [postApi?.isSuccess, router])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    postApi?.mutateAsync(values)
  }

  return (
    <FormContainer title='Sign Up'>
      {postApi?.isError && <Message value={postApi?.error} />}

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
            loading={postApi?.isPending}
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

      {postApi?.isSuccess && (
        <div className='text-green-500 text-center mt-5'>
          Please check your email to verify your account
        </div>
      )}
    </FormContainer>
  )
}

export default Page

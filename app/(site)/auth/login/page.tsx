'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import useUserInfoStore from '@/zustand/userStore'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import ApiCall from '@/services/api'

const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const postApi = ApiCall({
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

  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    postApi?.mutateAsync(values)
  }

  return (
    <FormContainer title='Sign In'>
      {postApi?.isError && <Message value={postApi?.error} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
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
            placeholder='Enter password'
            type='password'
          />

          <FormButton
            loading={postApi?.isPending}
            label='Sign In'
            className='w-full'
          />
          <FormButton
            label='Sign up'
            className='w-full'
            type='button'
            variant='outline'
            onClick={() => router.push('/auth/register')}
          />
        </form>
      </Form>

      <div className='row pt-3'>
        <div className='col'>
          <Link href='/auth/forgot-password' className='ps-1'>
            Forgot Password?
          </Link>
        </div>
      </div>
    </FormContainer>
  )
}

export default Page

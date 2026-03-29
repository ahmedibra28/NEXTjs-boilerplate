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
import { authClient } from '@/lib/auth-client'

const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const [message, setMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true)
    setMessage('')

    const result = await authClient.signIn.email(values)

    if (result.error) {
      setLoading(false)
      setMessage(result.error.message || 'Unable to sign in')
      return
    }

    const session = await authClient.getSession()

    if (session.data?.user) {
      const { user, session: currentSession } = session.data
      const sessionUser = user as typeof user & {
        menu?: any[]
        routes?: any[]
        mobile?: string | null
        role?: string
        permissions?: { key: string; name: string; description?: string | null }[]
      }
      updateUserInfo({
        id: sessionUser.id,
        email: sessionUser.email,
        menu: sessionUser.menu || [],
        routes: sessionUser.routes || [],
        token: currentSession?.token || null,
        name: sessionUser.name,
        mobile: sessionUser.mobile || null,
        role: sessionUser.role || '',
        permissions: sessionUser.permissions || [],
        image: sessionUser.image || '',
      })
    }

    setLoading(false)
  }

  return (
    <FormContainer title='Sign In'>
      {message && <Message value={message} />}

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
            loading={loading}
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

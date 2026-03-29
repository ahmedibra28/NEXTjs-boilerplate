'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import { authClient } from '@/lib/auth-client'

const Page = () => {
  const router = useRouter()
  const { userInfo } = useUserInfoStore((state) => state)

  const FormSchema = z.object({
    email: z.string().email(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  const [message, setMessage] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true)
    setMessage('')
    setSuccess(false)

    const result = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (result.error) {
      setLoading(false)
      setMessage(result.error.message || 'Unable to send reset email')
      return
    }

    form.reset()
    setSuccess(true)
    setLoading(false)
  }

  useEffect(() => {
    userInfo.id && router.push('/')
  }, [router, userInfo.id])

  return (
    <FormContainer title='Forgot Password'>
      <Head>
        <title>Forgot</title>
        <meta property='og:title' content='Forgot' key='title' />
      </Head>
      {success && <Message value='Please check your email to reset your password' />}
      {message && <Message value={message} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <CustomFormField
            form={form}
            name='email'
            label='Email'
            placeholder='Enter email'
          />

          <FormButton
            loading={loading}
            label='Send'
            className='w-full'
          />
        </form>
      </Form>

      {success && (
        <div className='text-green-500 text-center mt-5'>
          Please check your email to reset your password
        </div>
      )}
    </FormContainer>
  )
}

export default Page

'use client'
import React, { useEffect } from 'react'
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

const Verification = ({
  params,
}: {
  params: {
    token: string
  }
}) => {
  const router = useRouter()
  const { token } = params
  const { userInfo } = useUserInfoStore((state) => state)

  const postApi = ApiCall({
    key: ['verification'],
    method: 'POST',
    url: `auth/verification`,
  })?.post

  function onSubmit() {
    postApi?.mutateAsync({ verificationToken: token })
  }

  useEffect(() => {
    if (postApi?.isSuccess) {
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    }
    // eslint-disable-next-line
  }, [postApi?.isSuccess, router])

  useEffect(() => {
    userInfo.id && router.push('/')
  }, [router, userInfo.id])

  return (
    <FormContainer title='Verification'>
      <Head>
        <title>Verification</title>
        <meta property='og:title' content='Verification' key='title' />
      </Head>
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}

      {postApi?.isError && <Message value={postApi?.error} />}

      <FormButton
        loading={postApi?.isPending}
        label='Verify Account'
        className='w-full'
        onClick={onSubmit}
      />
    </FormContainer>
  )
}

export default Verification

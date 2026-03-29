'use client'

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'

const VerificationPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <FormContainer title='Verification'>
      <Head>
        <title>Verification</title>
        <meta property='og:title' content='Verification' key='title' />
      </Head>

      {error ? (
        <Message value='Verification link is invalid or expired.' />
      ) : (
        <Message value='Your account has been verified successfully. You can now sign in.' />
      )}

      <div className='text-center mt-4'>
        <Link href='/auth/login' className='text-blue-600 underline'>
          Go to sign in
        </Link>
      </div>
    </FormContainer>
  )
}

export default VerificationPage

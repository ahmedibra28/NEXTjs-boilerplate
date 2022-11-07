import React, { useEffect } from 'react'
import { FormContainer, Message } from '../../components'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import apiHook from '../../api'
import { userInfo } from '../../api/api'
import { DynamicFormProps, inputEmail } from '../../utils/dForms'

const Forgot = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['forgot-password'],
    method: 'POST',
    url: `auth/forgot-password`,
  })?.post

  useEffect(() => {
    postApi?.isSuccess && reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo() && userInfo().userInfo && router.push('/')
  }, [router])

  const submitHandler = (data: { email?: string }) => {
    postApi?.mutateAsync(data)
  }
  return (
    <FormContainer>
      <Head>
        <title>Forgot</title>
        <meta property="og:title" content="Forgot" key="title" />
      </Head>
      <h3 className="fw-light font-monospace text-center">Forgot Password</h3>
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value="An email has been sent with further instructions."
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputEmail({
          register,
          errors,
          label: 'Email',
          name: 'email',
          placeholder: 'Email',
        } as DynamicFormProps)}

        <button
          type="submit"
          className="btn btn-primary form-control "
          disabled={postApi?.isLoading}
        >
          {postApi?.isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Send'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default Forgot

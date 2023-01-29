import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import apiHook from '../../api'
import { DynamicFormProps, inputEmail, inputPassword } from '../../utils/dForms'
import useStore from '../../zustand/useStore'

const Login = () => {
  const router = useRouter()
  const pathName = router.query.next || '/'
  const { userInfo, login } = useStore((state) => state) as {
    userInfo: any
    login: () => void
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['login'],
    method: 'POST',
    url: `auth/login`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      typeof window !== undefined &&
        localStorage.setItem('userInfo', JSON.stringify(postApi?.data))

      login()
      router.push(pathName as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo && router.push('/')
  }, [router])

  const submitHandler = async (data: { email?: string; password?: string }) => {
    postApi?.mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Login</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <h3 className="fw-light font-monospace text-center">Sign In</h3>
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputEmail({
          register,
          errors,
          label: 'Email',
          name: 'email',
          placeholder: 'Email',
        } as DynamicFormProps)}
        {inputPassword({
          register,
          errors,
          label: 'Password',
          name: 'password',
          placeholder: 'Password',
        } as DynamicFormProps)}
        <button
          type="submit"
          className="btn btn-primary form-control "
          disabled={postApi?.isLoading}
        >
          {postApi?.isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      <div className="row pt-3">
        <div className="col">
          <Link
            href="/auth/forgot-password"
            className="ps-1 text-decoration-none"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </FormContainer>
  )
}

export default Login

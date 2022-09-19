import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import useProfilesHook from '../../utils/api/profiles'
import useUploadHook from '../../utils/api/upload'
import {
  inputFile,
  inputPassword,
  inputTel,
  inputText,
  inputTextArea,
} from '../../utils/dynamicForm'
import Image from 'next/image'
import { Spinner } from '../../components'

const Profile = () => {
  const [file, setFile] = useState(null)
  const [fileLink, setFileLink] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const { getProfile, postProfile } = useProfilesHook({
    page: 1,
    q: '',
    limit: 25,
  })
  const { postUpload } = useUploadHook()

  const { data, isLoading, isError, error } = getProfile
  const {
    data: dataUpload,
    isLoading: isLoadingUpload,
    isError: isErrorUpload,
    error: errorUpload,
    mutateAsync: mutateAsyncUpload,
    isSuccess: isSuccessUpload,
  } = postUpload

  const {
    isSuccess,
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync,
  } = postProfile

  useEffect(() => {
    setValue('name', !isLoading ? data && data.name : '')
    setValue('address', !isLoading ? data && data.address : '')
    setValue('phone', !isLoading ? data && data.phone : '')
    setValue('bio', !isLoading ? data && data.bio : '')
  }, [isLoading, setValue, data])

  const submitHandler = (data) => {
    if (!file && !fileLink) {
      mutateAsync({
        name: data.name,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        password: data.password,
      })
    } else {
      mutateAsync({
        name: data.name,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        password: data.password,
        image: fileLink,
      })
    }
  }

  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      mutateAsyncUpload({ type: 'image', formData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (isSuccessUpload) {
      setFileLink(
        dataUpload &&
          dataUpload.filePaths &&
          dataUpload.filePaths[0] &&
          dataUpload.filePaths[0].path
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpload])

  return (
    <FormContainer>
      <Head>
        <title>Profile</title>
        <meta property='og:title' content='Profile' key='title' />
      </Head>
      <h3 className='fw-light font-monospace text-center'>User Profile</h3>

      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}
      {isErrorUpload && <Message variant='danger'>{errorUpload}</Message>}
      {isError && <Message variant='danger'>{error}</Message>}
      {isSuccess && (
        <Message variant='success'>User has been updated successfully</Message>
      )}

      {isLoading && <Spinner />}
      <form onSubmit={handleSubmit(submitHandler)}>
        {data && data.image && (
          <div className='d-flex justify-content-center'>
            <Image
              src={data && data.image}
              alt='avatar'
              className='rounded-circle'
              width='200'
              height='200'
            />
          </div>
        )}

        <div className='row'>
          <div className='col-12'>
            {inputText({
              register,
              errors,
              label: 'Name',
              name: 'name',
              placeholder: 'Name',
            })}
          </div>
          <div className='col-md-6 col-12'>
            {inputText({
              register,
              errors,
              label: 'Address',
              name: 'address',
              placeholder: 'Address',
            })}
          </div>
          <div className='col-md-6 col-12'>
            {inputTel({
              register,
              errors,
              label: 'Phone',
              name: 'phone',
              placeholder: '+252 (61) 530-1507',
            })}
          </div>
          <div className='col-12'>
            {inputTextArea({
              register,
              errors,
              label: 'Bio',
              name: 'bio',
              placeholder: 'Tell us about yourself',
            })}
          </div>

          <div className='col-12'>
            {inputFile({
              register,
              errors,
              label: 'Image',
              name: 'image',
              setFile,
              isRequired: false,
              placeholder: 'Choose an image',
            })}
          </div>
          <div className='col-md-6 col-12'>
            {inputPassword({
              register,
              errors,
              label: 'Password',
              name: 'password',
              minLength: true,
              isRequired: false,
              placeholder: "Leave blank if you don't want to change",
            })}
          </div>
          <div className='col-md-6 col-12'>
            {inputPassword({
              register,
              errors,
              watch,
              name: 'confirmPassword',
              label: 'Confirm Password',
              validate: true,
              minLength: true,
              isRequired: false,
              placeholder: 'Confirm Password',
            })}
          </div>
        </div>

        <button
          type='submit'
          className='btn btn-primary form-control'
          disabled={isLoadingPost || isLoadingUpload}
        >
          {isLoadingPost || isLoadingUpload ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Profile)), { ssr: false })

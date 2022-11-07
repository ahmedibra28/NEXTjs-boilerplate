import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../hoc/withAuth'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import {
  DynamicFormProps,
  inputFile,
  inputPassword,
  inputTel,
  inputText,
  inputTextArea,
} from '../../utils/dForms'
import Image from 'next/image'
import { Spinner } from '../../components'
import apiHook from '../../api'
import { IProfile } from '../../models/Profile'

interface IProfileFormValueProps extends Omit<IProfile, '_id' | 'user'> {
  password?: string
}

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

  const getApi = apiHook({
    key: ['profiles'],
    method: 'GET',
    url: `auth/profile`,
  })?.get
  const postApi = apiHook({
    key: ['profiles'],
    method: 'POST',
    url: `auth/profile`,
  })?.post
  const updateApi = apiHook({
    key: ['upload'],
    method: 'UPLOAD',
    url: `upload?type=image`,
  })?.upload

  useEffect(() => {
    if (postApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    setValue('name', !getApi?.isLoading ? getApi?.data?.name : '')
    setValue('address', !getApi?.isLoading ? getApi?.data?.address : '')
    setValue('phone', !getApi?.isLoading ? getApi?.data?.phone : '')
    setValue('bio', !getApi?.isLoading ? getApi?.data?.bio : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApi?.isLoading, setValue])

  const submitHandler = (data: IProfileFormValueProps) => {
    if (!file && !fileLink) {
      postApi?.mutateAsync({
        name: data?.name,
        address: data?.address,
        phone: data?.phone,
        bio: data?.bio,
        password: data?.password,
      })
    } else {
      postApi?.mutateAsync({
        ...data,
        image: fileLink,
      })
    }
  }

  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      updateApi?.mutateAsync({ _id: getApi?.data?.data?._id, ...formData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (updateApi?.isSuccess) {
      setFileLink(
        updateApi?.data &&
          updateApi?.data.filePaths &&
          updateApi?.data.filePaths[0] &&
          updateApi?.data.filePaths[0].path
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateApi?.isSuccess])

  return (
    <FormContainer>
      <Head>
        <title>Profile</title>
        <meta property="og:title" content="Profile" key="title" />
      </Head>
      <h3 className="fw-light font-monospace text-center">User Profile</h3>

      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}
      {getApi?.isError && <Message variant="danger" value={getApi?.error} />}
      {postApi?.isSuccess && (
        <Message variant="danger" value="User has been updated successfully" />
      )}

      {getApi?.isLoading && <Spinner />}
      <form onSubmit={handleSubmit(submitHandler)}>
        {getApi?.data?.image && (
          <div className="d-flex justify-content-center">
            <Image
              src={getApi?.data?.image}
              alt="avatar"
              className="rounded-circle"
              width="200"
              height="200"
            />
          </div>
        )}

        <div className="row">
          <div className="col-12">
            {inputText({
              register,
              errors,
              label: 'Name',
              name: 'name',
              placeholder: 'Name',
            } as DynamicFormProps)}
          </div>
          <div className="col-md-6 col-12">
            {inputText({
              register,
              errors,
              label: 'Address',
              name: 'address',
              placeholder: 'Address',
            } as DynamicFormProps)}
          </div>
          <div className="col-md-6 col-12">
            {inputTel({
              register,
              errors,
              label: 'Phone',
              name: 'phone',
              placeholder: '+252 (61) 530-1507',
            } as DynamicFormProps)}
          </div>
          <div className="col-12">
            {inputTextArea({
              register,
              errors,
              label: 'Bio',
              name: 'bio',
              placeholder: 'Tell us about yourself',
            } as DynamicFormProps)}
          </div>

          <div className="col-12">
            {inputFile({
              register,
              errors,
              label: 'Image',
              name: 'image',
              setFile,
              isRequired: false,
              placeholder: 'Choose an image',
            } as DynamicFormProps)}
          </div>
          <div className="col-md-6 col-12">
            {inputPassword({
              register,
              errors,
              label: 'Password',
              name: 'password',
              minLength: true,
              isRequired: false,
              placeholder: "Leave blank if you don't want to change",
            } as DynamicFormProps)}
          </div>
          <div className="col-md-6 col-12">
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
            } as DynamicFormProps)}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary form-control"
          disabled={postApi?.isLoading || updateApi?.isLoading}
        >
          {postApi?.isLoading || updateApi?.isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Profile)), { ssr: false })

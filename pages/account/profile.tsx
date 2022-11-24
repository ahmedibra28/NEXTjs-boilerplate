import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { FormContainer, Message, Meta } from '../../components'
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
  const updateApi = apiHook({
    key: ['profiles'],
    method: 'PUT',
    url: `auth/profile`,
  })?.put
  const uploadApi = apiHook({
    key: ['upload'],
    method: 'POST',
    url: `upload?type=image`,
  })?.post

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateApi?.isSuccess])

  useEffect(() => {
    setValue('name', !getApi?.isLoading ? getApi?.data?.name : '')
    setValue('address', !getApi?.isLoading ? getApi?.data?.address : '')
    setValue('mobile', !getApi?.isLoading ? getApi?.data?.mobile : '')
    setValue('bio', !getApi?.isLoading ? getApi?.data?.bio : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApi?.isLoading, setValue])

  const submitHandler = (data: IProfileFormValueProps) => {
    if (!file && !fileLink) {
      updateApi?.mutateAsync({
        _id: getApi?.data?.user?._id,
        name: data?.name,
        address: data?.address,
        mobile: data?.mobile,
        bio: data?.bio,
        password: data?.password,
      })
    } else {
      updateApi?.mutateAsync({
        ...data,
        _id: getApi?.data?.user?._id,
        image: fileLink,
      })
    }
  }

  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      uploadApi?.mutateAsync(formData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (uploadApi?.isSuccess) {
      setFileLink(uploadApi?.data.filePaths?.[0]?.path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadApi?.isSuccess])

  return (
    <FormContainer>
      <Meta title="Profile" />
      <h3 className="fw-light font-monospace text-center">User Profile</h3>

      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}

      {uploadApi?.isError && (
        <Message variant="danger" value={uploadApi?.error} />
      )}
      {getApi?.isError && <Message variant="danger" value={getApi?.error} />}
      {updateApi?.isSuccess && (
        <Message variant="success" value="User has been updated successfully" />
      )}

      {getApi?.isLoading && <Spinner />}
      <form onSubmit={handleSubmit(submitHandler)}>
        {getApi?.data?.image && (
          <div className="text-center rounded-pill">
            <Image
              src={getApi?.data?.image}
              alt="avatar"
              width="100"
              height="100"
              style={{ objectFit: 'cover' }}
              className="rounded-pill"
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
              label: 'Mobile',
              name: 'mobile',
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
          disabled={updateApi?.isLoading || uploadApi?.isLoading}
        >
          {updateApi?.isLoading || uploadApi?.isLoading ? (
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

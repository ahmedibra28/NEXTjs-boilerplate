'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

import Image from 'next/image'
import useApi from '@/hooks/useApi'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import {
  CustomSubmitButton,
  InputFile,
  InputPassword,
  InputTel,
  InputText,
} from '@/components/dForms'
import useUserInfoStore from '@/zustand/userStore'

const Profile = () => {
  const [file, setFile] = useState(null)
  const [fileLink, setFileLink] = useState(null)

  const path = useAuthorization()
  const router = useRouter()

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const getApi = useApi({
    key: ['profiles'],
    method: 'GET',
    url: `profile`,
  })?.get
  const updateApi = useApi({
    key: ['profiles'],
    method: 'PUT',
    url: `profile`,
  })?.put
  const uploadApi = useApi({
    key: ['upload'],
    method: 'POST',
    url: `upload?type=image`,
  })?.post

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      const { name, mobile, email, image } = updateApi?.data
      updateUserInfo({
        ...userInfo,
        name,
        mobile,
        email,
        image,
      })
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

  const submitHandler = (data: any) => {
    if (!file && !fileLink) {
      updateApi?.mutateAsync({
        id: getApi?.data?.id,
        name: data?.name,
        address: data?.address,
        mobile: data?.mobile,
        bio: data?.bio,
        password: data?.password,
      })
    } else {
      updateApi?.mutateAsync({
        ...data,
        id: getApi?.data?.id,
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
    <Fragment>
      {updateApi?.isError && (
        <Message variant='error' value={updateApi?.error} />
      )}

      {uploadApi?.isError && (
        <Message variant='error' value={uploadApi?.error} />
      )}
      {getApi?.isError && <Message variant='error' value={getApi?.error} />}
      {updateApi?.isSuccess && (
        <Message variant='success' value={updateApi?.data?.message} />
      )}

      {getApi?.isLoading && <Spinner />}

      <div className='bg-opacity-60 max-w-4xl mx-auto'>
        <div className='divider text-3xl uppercase '>{userInfo.name}</div>
        <div className='text-center mb-10'>
          <div className='badge badge-neutral'>
            <span> {userInfo.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          {getApi?.data?.image && (
            <div className='avatar text-center flex justify-center'>
              <div className='w-32 mask mask-hexagon'>
                <Image
                  src={getApi?.data?.image}
                  alt='avatar'
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          <div className='flex flex-row flex-wrap gap-2'>
            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputText
                register={register}
                errors={errors}
                label='Name'
                name='name'
                placeholder='Name'
              />
            </div>
            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputText
                register={register}
                errors={errors}
                label='Address'
                name='address'
                placeholder='Address'
              />
            </div>

            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputTel
                register={register}
                errors={errors}
                label='Mobile'
                name='mobile'
                placeholder='+252 (61) 530-1507'
              />
            </div>

            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputText
                register={register}
                errors={errors}
                label='Bio'
                name='bio'
                placeholder='Tell us about yourself'
              />
            </div>

            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputFile
                register={register}
                errors={errors}
                label='Image'
                name='image'
                setFile={setFile}
                isRequired={false}
                placeholder='Choose an image'
              />
            </div>

            <div className='flex justify-start flex-wrap flex-row w-full gap-2'>
              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <InputPassword
                  register={register}
                  errors={errors}
                  label='Password'
                  name='password'
                  minLength={true}
                  isRequired={false}
                  placeholder="Leave blank if you don't want to change"
                />
              </div>
              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <InputPassword
                  register={register}
                  errors={errors}
                  label='Confirm Password'
                  name='confirmPassword'
                  minLength={true}
                  isRequired={false}
                  validate={true}
                  placeholder='Confirm Password'
                  watch={watch}
                />
              </div>
            </div>
          </div>

          <div className='w-full md:w-[48%] lg:w-[32%]'>
            <CustomSubmitButton
              isLoading={updateApi?.isLoading}
              label='Update'
            />
          </div>
        </form>
      </div>
    </Fragment>
  )
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
})

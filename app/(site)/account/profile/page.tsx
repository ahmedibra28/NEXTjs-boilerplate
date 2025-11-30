'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

import Image from 'next/image'
import Message from '@/components/message'
import Spinner from '@/components/spinner'
import useUserInfoStore from '@/zustand/userStore'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import ApiCall from '@/services/api'
import { LockIcon, MapPinIcon, PencilIcon, UserIcon } from 'lucide-react'
import { DragDropUpload } from '@/components/drag-drop-upload'

const Profile = () => {
  const [fileLink, setFileLink] = React.useState<string[]>([])

  const path = useAuthorization()
  const router = useRouter()

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = ApiCall({
    key: ['profiles'],
    method: 'GET',
    url: `profile`,
  })?.get
  const updateApi = ApiCall({
    key: ['profiles'],
    method: 'PUT',
    url: `profile`,
  })?.put

  const FormSchema = z
    .object({
      name: z.string(),
      mobile: z.string(),
      bio: z.string(),
      password: z.string().refine((val) => val.length === 0 || val.length > 6, {
        message: "Password can't be less than 6 characters",
      }),
      confirmPassword: z
        .string()
        .refine((val) => val.length === 0 || val.length > 6, {
          message: "Confirm password can't be less than 6 characters",
        }),
      // Address fields
      street: z.string(),
      city: z.string(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password do not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      mobile: '',
      bio: '',
      password: '',
      confirmPassword: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const { street, city, state, zipCode, country, ...userData } = values

    updateApi?.mutateAsync({
      ...userData,
      id: getApi?.data?.id,
      image: fileLink ? fileLink[0] : getApi?.data?.image,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
      },
    })
  }

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
      setFileLink([])
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  useEffect(() => {
    form.setValue('name', !getApi?.isPending ? getApi?.data?.name : '')
    form.setValue('mobile', !getApi?.isPending ? getApi?.data?.mobile : '')
    form.setValue('bio', !getApi?.isPending ? getApi?.data?.bio : '')

    // Set address values if they exist
    if (!getApi?.isPending && getApi?.data?.address) {
      form.setValue('street', getApi.data.address.street || '')
      form.setValue('city', getApi.data.address.city || '')
      form.setValue('state', getApi.data.address.state || '')
      form.setValue('zipCode', getApi.data.address.zipCode || '')
      form.setValue('country', getApi.data.address.country || '')
    }

    setFileLink(!getApi?.isPending ? [getApi?.data?.image] : [])
    // eslint-disable-next-line
  }, [getApi?.isPending, form.setValue])

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Status Messages */}
      <div className='mb-6 space-y-3'>
        {updateApi?.isError && <Message value={updateApi?.error} />}
        {getApi?.isError && <Message value={getApi?.error} />}
        {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      </div>

      {getApi?.isPending && <Spinner />}

      {/* Profile Card */}
      <div className='bg-white rounded-2xl shadow-md overflow-hidden'>
        {/* Profile Header with Cover Photo */}
        <div className='relative bg-gradient-to-r from-blue-500 to-indigo-600 h-32'>
          <div className='absolute -bottom-16 left-6'>
            <div className='relative'>
              {getApi?.data?.image ? (
                <div className='w-32 h-32 rounded-xl border-4 border-white shadow-md overflow-hidden'>
                  <Image
                    src={getApi.data.image}
                    alt='avatar'
                    width={128}
                    height={128}
                    className='object-cover w-full h-full'
                  />
                </div>
              ) : (
                <div className='w-32 h-32 rounded-xl border-4 border-white bg-gray-200 shadow-md flex items-center justify-center'>
                  <span className='text-4xl text-gray-600 font-bold'>
                    {userInfo.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className='absolute -bottom-2 -right-2 px-3 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white shadow-sm'>
                {userInfo.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className='pt-20 px-6 pb-6'>
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                {userInfo.name}
              </h1>
              <p className='text-gray-500'>
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Personal Info Section */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-6'>
                  <h3 className='text-lg font-semibold text-gray-700 flex items-center'>
                    <UserIcon className='w-5 h-5 mr-2 text-indigo-500' />
                    Basic Information
                  </h3>
                  <CustomFormField
                    form={form}
                    name='name'
                    label='Full Name'
                    placeholder='Your full name'
                    type='text'
                  />
                  <CustomFormField
                    form={form}
                    name='mobile'
                    label='Phone Number'
                    placeholder='+1 (___) ___-____'
                    type='tel'
                  />
                </div>

                <div className='space-y-6'>
                  <h3 className='text-lg font-semibold text-gray-700 flex items-center'>
                    <MapPinIcon className='w-5 h-5 mr-2 text-indigo-500' />
                    Profile Image
                  </h3>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Profile Photo
                    </label>
                    <DragDropUpload
                      fileType='image'
                      onUploadSuccess={setFileLink}
                      multiple={false}
                    />
                    {fileLink.length > 0 && (
                      <div className='flex items-center mt-2'>
                        <div className='w-10 h-10 rounded-md overflow-hidden mr-2'>
                          <Image
                            src={fileLink[0]}
                            alt='preview'
                            width={40}
                            height={40}
                            className='object-cover w-full h-full'
                          />
                        </div>
                        <span className='text-sm text-gray-500'>
                          New photo selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center mb-4'>
                  <PencilIcon className='w-5 h-5 mr-2 text-indigo-500' />
                  About You
                </h3>
                <CustomFormField
                  form={form}
                  name='bio'
                  label='Bio'
                  placeholder='Tell us about yourself...'
                  type='textarea'
                  rows={3}
                />
              </div>

              {/* Address Section */}
              <div className='bg-gray-50 p-5 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center mb-4'>
                  <MapPinIcon className='w-5 h-5 mr-2 text-indigo-500' />
                  Address Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <CustomFormField
                    form={form}
                    name='street'
                    label='Street Address'
                    placeholder='123 Main St'
                    type='text'
                  />
                  <CustomFormField
                    form={form}
                    name='city'
                    label='City'
                    placeholder='Mogadishu'
                    type='text'
                  />
                  <CustomFormField
                    form={form}
                    name='state'
                    label='State/Province'
                    placeholder='BN'
                    type='text'
                  />
                  <CustomFormField
                    form={form}
                    name='zipCode'
                    label='Zip/Postal Code'
                    placeholder='02010'
                    type='text'
                  />
                  <CustomFormField
                    form={form}
                    name='country'
                    label='Country'
                    placeholder='Somalia'
                    type='text'
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className='bg-gray-50 p-5 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center mb-4'>
                  <LockIcon className='w-5 h-5 mr-2 text-indigo-500' />
                  Change Password
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <CustomFormField
                    form={form}
                    name='password'
                    label='New Password'
                    placeholder='••••••••'
                    type='password'
                  />
                  <CustomFormField
                    form={form}
                    name='confirmPassword'
                    label='Confirm Password'
                    placeholder='••••••••'
                    type='password'
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className='flex justify-end pt-2'>
                <FormButton
                  loading={updateApi?.isPending}
                  label='Save Changes'
                  className='px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm'
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
})

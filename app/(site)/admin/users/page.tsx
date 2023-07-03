'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import { FaCheckCircle, FaPenAlt, FaTimesCircle, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import Confirm from '@/components/Confirm'
import { useRouter } from 'next/navigation'
import {
  Autocomplete,
  ButtonCircle,
  InputCheckBox,
  InputEmail,
  InputPassword,
  InputText,
} from '@/components/dForms'
import Message from '@/components/Message'
import Pagination from '@/components/Pagination'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import Search from '@/components/Search'
import { IUser } from '@/types'

const Page = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [val, setVal] = useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['users'],
    method: 'GET',
    url: `users?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const getRolesApi = useApi({
    key: ['roles'],
    method: 'GET',
    url: `roles?page=1&q=${val}&limit=${10}`,
  })?.get

  const postApi = useApi({
    key: ['users'],
    method: 'POST',
    url: `users`,
  })?.post

  const updateApi = useApi({
    key: ['users'],
    method: 'PUT',
    url: `users`,
  })?.put

  const deleteApi = useApi({
    key: ['users'],
    method: 'DELETE',
    url: `users`,
  })?.deleteObj

  useEffect(() => {
    if (val) {
      getRolesApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess)
      formCleanHandler()
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  // TableView
  const table = {
    header: ['Name', 'Email'],
    body: ['name', 'email'],
    createdAt: 'createdAt',
    confirmed: 'confirmed',
    blocked: 'blocked',
    data: getApi?.data,
  }

  const editHandler = (item: IUser) => {
    setId(item.id)
    setValue('blocked', item?.blocked)
    setValue('confirmed', item?.confirmed)
    setValue('name', item?.name)
    setValue('email', item?.email)
    setValue('roleId', item?.role.name)
    setVal(item?.role.name)

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Users List'
  const label = 'User'
  const modal = 'user'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setId(null)
    setVal('')
    getRolesApi?.refetch()
  }

  const submitHandler = (data: object) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={0} className='col-12'>
      <InputText
        register={register}
        errors={errors}
        label='Name'
        name='name'
        placeholder='Enter name'
      />
    </div>,

    <div key={1} className='col-12'>
      <InputEmail
        register={register}
        errors={errors}
        label='Email'
        name='email'
        placeholder='Enter email address'
      />
    </div>,
    <div key={12} className='col-12'>
      <Autocomplete
        register={register}
        errors={errors}
        label='Role'
        name='roleId'
        items={getRolesApi?.data?.data}
        item='name'
        value={val}
        onChange={setVal}
        setValue={setValue}
      />
    </div>,
    <div key={2} className='col-lg-6 col-md-6 col-12'>
      <InputPassword
        register={register}
        errors={errors}
        label='Password'
        name='password'
        placeholder='Enter password'
        isRequired={false}
      />
    </div>,
    <div key={3} className='col-lg-6 col-md-6 col-12'>
      <InputPassword
        register={register}
        errors={errors}
        label='Confirm Password'
        name='confirmPassword'
        placeholder='Enter confirm password'
        isRequired={false}
        minLength={true}
        validate={true}
        watch={watch}
      />
    </div>,

    <div key={4} className='col-12'>
      <InputCheckBox
        register={register}
        errors={errors}
        label='Confirmed'
        name='confirmed'
        isRequired={false}
      />
    </div>,
    <div key={5} className='col-12'>
      <InputCheckBox
        register={register}
        errors={errors}
        label='Blocked'
        name='blocked'
        isRequired={false}
      />
    </div>,
  ]

  return (
    <>
      {deleteApi?.isSuccess && (
        <Message variant='success' value={deleteApi?.data?.message} />
      )}
      {deleteApi?.isError && (
        <Message variant='error' value={deleteApi?.error} />
      )}
      {updateApi?.isSuccess && (
        <Message variant='success' value={updateApi?.data?.message} />
      )}
      {updateApi?.isError && (
        <Message variant='error' value={updateApi?.error} />
      )}
      {postApi?.isSuccess && (
        <Message variant='success' value={postApi?.data?.message} />
      )}
      {postApi?.isError && <Message variant='error' value={postApi?.error} />}

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      <FormView
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isLoading}
        isLoadingPost={postApi?.isLoading}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={`${edit ? 'Edit' : 'Add New'} ${label}`}
        modalSize='max-w-xl'
      />

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant='error' value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <div className='flex items-center flex-col mb-2'>
            <h1 className='font-light text-2xl'>
              {name}
              <sup> [{table?.data?.total}] </sup>
            </h1>
            <button
              className='btn btn-outline btn-primary btn-sm shadow my-2 rounded-none'
              // @ts-ignore
              onClick={() => window[modal].showModal()}
            >
              Add New {label}
            </button>
            <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%] mx-auto'>
              <Search
                placeholder='Search by email'
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className='table table-xs md:table-sm'>
            <thead className='border-0'>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th className='hidden md:table-cell'>Role</th>
                <th className='hidden md:table-cell'>Confirmed</th>
                <th className='hidden md:table-cell'>Blocked</th>
                <th className='hidden md:table-cell'>DateTime</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IUser, i: number) => (
                <tr key={i} className='hover'>
                  <td>{item?.name}</td>
                  <td>{item?.email}</td>
                  <td className='hidden md:table-cell'>{item?.role?.type}</td>
                  <td className='hidden md:table-cell'>
                    {item?.confirmed ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-error' />
                    )}
                  </td>
                  <td className='hidden md:table-cell'>
                    {item?.blocked ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-error' />
                    )}
                  </td>
                  <td className='hidden md:table-cell'>
                    {moment(item?.createdAt).format('lll')}
                  </td>
                  <td>
                    <div className='btn-group'>
                      <ButtonCircle
                        isLoading={false}
                        onClick={() => {
                          editHandler(item)
                          // @ts-ignore
                          window[modal].showModal()
                        }}
                        icon={<FaPenAlt className='text-white' />}
                        classStyle='btn-primary'
                      />

                      <ButtonCircle
                        isLoading={deleteApi?.isLoading}
                        onClick={() => deleteHandler(item.id)}
                        icon={<FaTrash className='text-white' />}
                        classStyle='btn-error'
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import Confirm from '@/components/Confirm'
import { useRouter } from 'next/navigation'
import { ButtonCircle, InputText, StaticInputSelect } from '@/components/dForms'
import Message from '@/components/Message'
import Pagination from '@/components/Pagination'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import Search from '@/components/Search'
import { IPermission } from '@/types'
import TableView from '@/components/TableView'

const Page = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['permissions'],
    method: 'GET',
    url: `permissions?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = useApi({
    key: ['permissions'],
    method: 'POST',
    url: `permissions`,
  })?.post

  const updateApi = useApi({
    key: ['permissions'],
    method: 'PUT',
    url: `permissions`,
  })?.put

  const deleteApi = useApi({
    key: ['permissions'],
    method: 'DELETE',
    url: `permissions`,
  })?.deleteObj

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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

  const editHandler = (item: IPermission) => {
    setId(item.id)
    setValue('name', item?.name)
    setValue('description', item?.description)
    setValue('method', item?.method)
    setValue('route', item?.route)

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Permissions List'
  const label = 'Permission'
  const modal = 'permission'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setId(null)
  }

  const submitHandler = (data: object) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  // TableView
  const table = {
    header: [
      { title: 'Name' },
      { title: 'Method' },
      { title: 'Route', className: 'hidden md:table-cell' },
      { title: 'CreatedAt', className: 'hidden md:table-cell' },
      { title: 'Action' },
    ],
    body: [
      { format: (item: any) => item?.name },
      {
        format: (item: any) =>
          item?.method === 'GET' ? (
            <span className='text-green-500'>{item?.method}</span>
          ) : item?.method === 'POST' ? (
            <span className='text-blue-500'>{item?.method}</span>
          ) : item?.method === 'PUT' ? (
            <span className='text-yellow-500'>{item?.method}</span>
          ) : (
            <span className='text-red-500'>{item?.method}</span>
          ),
      },
      {
        className: 'hidden md:table-cell',
        format: (item: any) => item?.route,
      },
      {
        className: 'hidden md:table-cell',
        format: (item: any) => moment(item?.createdAt).format('DD-MM-YYYY'),
      },
      {
        format: (item: any) => (
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
        ),
      },
    ],
    data: getApi?.data?.data,
    total: getApi?.data?.total,
    paginationData: getApi?.data,
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
    <div key={2} className='col-lg-6 col-md-6 col-12'>
      <StaticInputSelect
        register={register}
        errors={errors}
        label='Method'
        name='method'
        placeholder='Select method'
        isRequired={false}
        data={[
          { name: 'GET' },
          { name: 'POST' },
          { name: 'PUT' },
          { name: 'DELETE' },
        ]}
      />
    </div>,
    <div key={3} className='col-lg-6 col-md-6 col-12'>
      <InputText
        register={register}
        errors={errors}
        label='Route'
        name='route'
        placeholder='Enter Route'
      />
    </div>,
    <div key={4} className='col-12'>
      <InputText
        register={register}
        errors={errors}
        label='Description'
        name='description'
        isRequired={false}
        placeholder='Description'
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
        <Pagination data={table?.paginationData} setPage={setPage} />
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
              <sup> [{table?.total}] </sup>
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
                placeholder='Search by name'
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <TableView table={table} />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

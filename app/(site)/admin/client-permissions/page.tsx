'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import { FaBars, FaFilePen, FaTrash } from 'react-icons/fa6'
import moment from 'moment'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import Confirm from '@/components/Confirm'
import { useRouter } from 'next/navigation'
import { ButtonCircle, InputNumber, InputText } from '@/components/dForms'
import Message from '@/components/Message'
import Pagination from '@/components/Pagination'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import Search from '@/components/Search'
import { IClientPermission } from '@/types'
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
    key: ['client-permissions'],
    method: 'GET',
    url: `client-permissions?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = useApi({
    key: ['client-permissions'],
    method: 'POST',
    url: `client-permissions`,
  })?.post

  const updateApi = useApi({
    key: ['client-permissions'],
    method: 'PUT',
    url: `client-permissions`,
  })?.put

  const deleteApi = useApi({
    key: ['client-permissions'],
    method: 'DELETE',
    url: `client-permissions`,
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

  const editHandler = (item: IClientPermission) => {
    setId(item.id)
    setValue('name', item?.name)
    setValue('description', item?.description)
    setValue('menu', item?.menu)
    setValue('path', item?.path)
    setValue('sort', item?.sort)

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Client Permissions List'
  const label = 'Client Permission'
  const modal = 'clientPermission'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setId(null)
    // @ts-ignore
    window[modal].close()
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
      { title: 'Menu' },
      { title: 'Sort' },
      { title: 'Path', className: 'hidden md:table-cell' },
      { title: 'Description', className: 'hidden md:table-cell' },
      { title: 'CreatedAt', className: 'hidden md:table-cell' },
      { title: 'Action' },
    ],
    body: [
      { format: (item: any) => item?.name },
      { format: (item: any) => item?.menu },
      { format: (item: any) => item?.sort },

      {
        className: 'hidden md:table-cell',
        format: (item: any) => item?.path,
      },
      {
        className: 'hidden md:table-cell',
        format: (item: any) => item?.description,
      },
      {
        className: 'hidden md:table-cell',
        format: (item: any) => moment(item?.createdAt).format('DD-MM-YYYY'),
      },
      {
        format: (item: any) => (
          <div className='dropdown dropdown-top dropdown-left z-50'>
            <label tabIndex={0} className='cursor-pointer'>
              <FaBars className='text-2xl' />
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content z-50 menu p-2 bg-white rounded-tl-box rounded-tr-box rounded-bl-box w-28 border border-gray-200 shadow'
            >
              <li className='h-10 w-24'>
                <ButtonCircle
                  isLoading={false}
                  label='Edit'
                  onClick={() => {
                    editHandler(item)
                    // @ts-ignore
                    window[modal].showModal()
                  }}
                  icon={<FaFilePen className='text-white' />}
                  classStyle='btn-primary justify-start text-white'
                />
              </li>
              <li className='h-10 w-24'>
                <ButtonCircle
                  isLoading={deleteApi?.isPending}
                  label='Delete'
                  onClick={() => deleteHandler(item.id)}
                  icon={<FaTrash className='text-white' />}
                  classStyle='btn-error justify-start text-white'
                />
              </li>
            </ul>
          </div>
        ),
      },
    ],
    data: getApi?.data?.data,
    total: getApi?.data?.total,
    paginationData: getApi?.data,
  }

  const form = [
    <div key={0} className='flex flex-wrap justify-between'>
      <div className='w-full'>
        <InputText
          register={register}
          errors={errors}
          label='Name'
          name='name'
          placeholder='Enter name'
        />
      </div>

      <div className='w-full'>
        <InputText
          register={register}
          errors={errors}
          label='Menu'
          name='menu'
          placeholder='Enter menu'
        />
      </div>

      <div className='w-full'>
        <InputNumber
          register={register}
          errors={errors}
          label='Sort'
          name='sort'
          placeholder='Enter sort'
        />
      </div>

      <div className='w-full'>
        <InputText
          register={register}
          errors={errors}
          label='Path'
          name='path'
          placeholder='Enter path'
        />
      </div>

      <div className='w-full'>
        <InputText
          register={register}
          errors={errors}
          label='Description'
          name='description'
          isRequired={false}
          placeholder='Description'
        />
      </div>
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
        <Pagination data={table.paginationData} setPage={setPage} />
      </div>

      <FormView
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isPending}
        isLoadingPost={postApi?.isPending}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={`${edit ? 'Edit' : 'Add New'} ${label}`}
        modalSize='max-w-xl'
      />

      {getApi?.isPending ? (
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

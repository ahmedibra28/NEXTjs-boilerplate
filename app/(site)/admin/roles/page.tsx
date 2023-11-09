'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import { FaBars, FaFilePen, FaTrash } from 'react-icons/fa6'
import moment from 'moment'
import useApi from '@/hooks/useApi'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import { IClientPermission, IPermission, IRole } from '@/types'
import Confirm from '@/components/Confirm'
import {
  ButtonCircle,
  InputMultipleCheckBox,
  InputText,
} from '@/components/dForms'
import Message from '@/components/Message'
import Pagination from '@/components/Pagination'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import Search from '@/components/Search'
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
    key: ['roles'],
    method: 'GET',
    url: `roles?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = useApi({
    key: ['roles'],
    method: 'POST',
    url: `roles`,
  })?.post

  const updateApi = useApi({
    key: ['roles'],
    method: 'PUT',
    url: `roles`,
  })?.put

  const deleteApi = useApi({
    key: ['roles'],
    method: 'DELETE',
    url: `roles`,
  })?.deleteObj

  const getClientPermissionsApi = useApi({
    key: ['client-permissions'],
    method: 'GET',
    url: `client-permissions?page=${page}&q=${q}&limit=${250}`,
  })?.get

  const getPermissionsApi = useApi({
    key: ['permissions'],
    method: 'GET',
    url: `permissions?page=${page}&q=${q}&limit=${250}`,
  })?.get

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

  const uniquePermissions = [
    ...(new Set(
      getPermissionsApi?.data?.data?.map((item: IPermission) => item.name)
    ) as any),
  ]?.map((group) => ({
    [group]: getPermissionsApi?.data?.data?.filter(
      (permission: IPermission) => permission?.name === group
    ),
  }))

  const uniqueClientPermissions = [
    ...(new Set(
      getClientPermissionsApi?.data?.data?.map(
        (item: IClientPermission) => item.menu
      )
    ) as any),
  ]?.map((group) => ({
    [group]: getClientPermissionsApi?.data?.data?.filter(
      (clientPermission: IClientPermission) => clientPermission?.menu === group
    ),
  }))

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      formCleanHandler()
      getApi?.refetch()
    }
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

  const editHandler = (item: IRole) => {
    setId(item.id)

    setValue('name', item?.name)
    setValue('description', item?.description)
    setEdit(true)

    const permission = [
      ...(new Set(item?.permissions?.map((item) => item.name)) as any),
    ]
      ?.map((group) => ({
        [group]: item?.permissions?.filter(
          (permission) => permission?.name === group
        ),
      }))
      ?.map((per) => {
        setValue(
          `permission-${Object.keys(per)[0]}`,
          Object.values(per)[0]?.map((per) => per?.id?.toString())
        )
      })

    const clientPermission = [
      ...(new Set(item.clientPermissions?.map((item) => item.menu)) as any),
    ]
      ?.map((group) => ({
        [group]: item?.clientPermissions?.filter(
          (clientPermission) => clientPermission?.menu === group
        ),
      }))
      ?.map((per) => {
        setValue(
          `clientPermission-${Object.keys(per)[0]}`,
          Object.values(per)[0]?.map((p) => p?.id?.toString())
        )
      })

    permission
    clientPermission
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Roles List'
  const label = 'Role'
  const modal = 'role'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setId(null)
    // @ts-ignore
    window[modal].close()
  }

  const submitHandler = (data: {
    [x: string]: any
    name?: any
    description?: any
  }) => {
    const permission = Object.keys(data)
      .filter((key) => key.startsWith('permission-'))
      ?.map((key) => data[key])
      ?.filter((value) => value)
      ?.join(',')
      .split(',')

    const clientPermission = Object.keys(data)
      .filter((key) => key.startsWith('clientPermission-'))
      ?.map((key) => data[key])
      ?.filter((value) => value)
      ?.join(',')
      .split(',')

    edit
      ? updateApi?.mutateAsync({
          id: id,
          name: data.name,
          permission,
          clientPermission,
          description: data.description,
        })
      : postApi?.mutateAsync({
          id: id,
          name: data.name,
          permission,
          clientPermission,
          description: data.description,
        })
  }

  // TableView
  const table = {
    header: [
      { title: 'Name' },
      { title: 'Type' },
      { title: 'Description', className: 'hidden md:table-cell' },
      { title: 'CreatedAt', className: 'hidden md:table-cell' },
      { title: 'Action' },
    ],
    body: [
      { format: (item: any) => item?.name },
      { format: (item: any) => item?.type?.toUpperCase() },
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
      <div className='w-full mb-5'>
        <InputText
          register={register}
          errors={errors}
          label='Name'
          name='name'
          placeholder='Enter name'
        />
      </div>

      <div className='w-full'>
        {uniquePermissions?.length > 0 &&
          uniquePermissions?.map((g, i) => (
            <div key={i} className='mb-1'>
              <label className='fw-bold text-uppercase'>
                {uniquePermissions?.length > 0 && Object.keys(g)[0]}
              </label>

              <InputMultipleCheckBox
                register={register}
                errors={errors}
                label={`${uniquePermissions?.length > 0 && Object.keys(g)[0]}`}
                name={`permission-${
                  uniquePermissions?.length > 0 && Object.keys(g)[0]
                }`}
                placeholder={`${
                  uniquePermissions?.length > 0 && Object.keys(g)[0]
                }`}
                data={
                  uniquePermissions?.length > 0 &&
                  Object.values(g)[0]?.map((item: any) => ({
                    name: `${item.method} - ${item.description}`,
                    id: item.id?.toString(),
                  }))
                }
                isRequired={false}
              />
            </div>
          ))}
      </div>

      <div className='w-full mb-5'>
        <InputText
          register={register}
          errors={errors}
          label='Description'
          name='description'
          isRequired={false}
          placeholder='Description'
        />
      </div>

      <div className='w-full'>
        {uniqueClientPermissions?.length > 0 &&
          uniqueClientPermissions?.map((g, i) => (
            <div key={i} className='mb-1'>
              <label className='fw-bold text-uppercase'>
                {uniqueClientPermissions?.length > 0 && Object.keys(g)[0]}
              </label>

              <InputMultipleCheckBox
                register={register}
                errors={errors}
                label={`${
                  uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
                }`}
                name={`clientPermission-${
                  uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
                }`}
                placeholder={`${
                  uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
                }`}
                data={
                  uniqueClientPermissions?.length > 0 &&
                  Object.values(g)[0]?.map(
                    (item: {
                      menu: any
                      path: any
                      id: any
                      description: string
                    }) => ({
                      name: `${item.description}`,
                      id: item.id?.toString(),
                    })
                  )
                }
                isRequired={false}
              />
            </div>
          ))}
      </div>
    </div>,
  ]

  return (
    <>
      {deleteApi?.isSuccess && (
        <Message
          variant='success'
          value={`${label} has been cancelled successfully.`}
        />
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

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
})

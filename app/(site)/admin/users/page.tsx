'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import Confirm from '@/components/Confirm'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import { IUser } from '@/types'
import { form } from './_component/form'
import RTable from '@/components/RTable'
import { columns } from './_component/columns'

type ISelect = { label?: string; value?: string }

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [roleValue, setRoleValue] = useState('')

  const [reactSelect, setReactSelect] = useState<
    { label?: string; value?: string; id?: string }[]
  >([])

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
    url: `users?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const getRolesApi = useApi({
    key: ['roles'],
    method: 'GET',
    url: `roles?page=1&q=${roleValue}&limit=${10}`,
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

  React.useEffect(() => {
    if (roleValue) {
      getRolesApi?.refetch()
    }
    // eslint-disable-next-line
  }, [roleValue])

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
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: IUser) => {
    setId(item.id)
    setValue('blocked', item?.blocked)
    setValue('confirmed', item?.confirmed)
    setValue('name', item?.name)
    setValue('email', item?.email)
    const role: ISelect = { label: item?.role?.name, value: item?.role?.id }
    setValue('roleId', role)
    setReactSelect([
      ...reactSelect.filter((item) => item.id !== 'roleId'),
      { ...role, id: 'roleId' },
    ])

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const label = 'User'
  const modal = 'user'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setId(null)
    setValue('roleId', null)
    setReactSelect([])
    getRolesApi?.refetch()
    // @ts-ignore
    window[modal].close()
  }

  const submitHandler = (data: any) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...data,
          roleId: data?.roleId?.value,
        })
      : postApi?.mutateAsync({ ...data, roleId: data?.roleId?.value })
  }

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <FormView
        formCleanHandler={formCleanHandler}
        form={form({
          register,
          errors,
          edit,
          watch,
          setValue,
          getRolesApi,
          reactSelect,
          setReactSelect,
          setRoleValue,
        })}
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
        <Message value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              deleteHandler,
              isPending: deleteApi?.isPending || false,
              modal,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Users List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

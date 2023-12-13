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
import { IClientPermission } from '@/types'
import { form } from './_component/form'
import RTable from '@/components/RTable'
import { columns } from './_component/columns'

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
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
    url: `client-permissions?page=${page}&q=${q}&limit=${limit}`,
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

      <FormView
        formCleanHandler={formCleanHandler}
        form={form({ register, errors })}
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
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

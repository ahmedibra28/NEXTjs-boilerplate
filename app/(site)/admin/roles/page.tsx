'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useApi from '@/hooks/useApi'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import { IClientPermission, IPermission, IRole } from '@/types'
import Confirm from '@/components/Confirm'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import RTable from '@/components/RTable'
import { columns } from './_component/columns'
import { form } from './_component/form'

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
    key: ['roles'],
    method: 'GET',
    url: `roles?page=${page}&q=${q}&limit=${limit}`,
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

  const label = 'Role'
  const modal = 'role'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setId(null)
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

  const formChildren = (
    <FormView
      formCleanHandler={formCleanHandler}
      form={form({
        register,
        errors,
        uniqueClientPermissions,
        uniquePermissions,
      })}
      loading={updateApi?.isPending || postApi?.isPending}
      handleSubmit={handleSubmit}
      submitHandler={submitHandler}
      label={`${edit ? 'Edit' : 'Add New'} ${label}`}
    />
  )

  return (
    <>
      {deleteApi?.isSuccess && (
        <Message value={`${label} has been cancelled successfully.`} />
      )}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

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
              formChildren,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Roles List'
          >
            {formChildren}
          </RTable>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
})

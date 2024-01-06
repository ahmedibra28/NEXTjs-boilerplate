'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type { Permission as IPermission } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import useEditStore from '@/zustand/editStore'
import { useColumn } from './hook/useColumn'
import { TopLoadingBar } from '@/components/TopLoadingBar'

const FormSchema = z.object({
  name: z.string().refine((value) => value !== '', {
    message: 'Name is required',
  }),
  method: z.string().refine((value) => value !== '', {
    message: 'Method is required',
  }),
  route: z.string().refine((value) => value !== '', {
    message: 'Route is required',
  }),
  description: z.string().optional(),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const { edit, setEdit } = useEditStore((state) => state)
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
    url: `permissions?page=${page}&q=${q}&limit=${limit}`,
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      method: '',
      route: '',
      description: '',
    },
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess)
      formCleanHandler()
    getApi?.refetch()
    // eslint-disable-next-line
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const refEdit = React.useRef(edit)
  const refId = React.useRef(id)

  const editHandler = (item: IPermission) => {
    setId(item.id!)
    setEdit(true)

    refEdit.current = true
    refId.current = item.id!
    form.setValue('name', item?.name)
    form.setValue('description', item?.description || '')
    form.setValue('method', item?.method)
    form.setValue('route', item?.route)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Permission'
  const modal = 'permission'

  const formCleanHandler = () => {
    form.reset()
    setEdit(false)
    setId(null)
    refEdit.current = false
    refId.current = null

    window.document.getElementById('dialog-close')?.click()
  }

  const methods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ]

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name='name'
        label='Name'
        placeholder='Name'
        type='text'
      />
      <CustomFormField
        form={form}
        name='method'
        label='Method'
        placeholder='Method'
        fieldType='command'
        data={methods}
      />
      <CustomFormField
        form={form}
        name='route'
        label='Route'
        placeholder='Route'
        type='text'
      />
      <CustomFormField
        form={form}
        name='description'
        label='Description'
        placeholder='Description'
        cols={3}
        rows={3}
      />
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    refEdit.current
      ? updateApi?.mutateAsync({
          id: refId.current,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  const formChildren = (
    <FormView
      formCleanHandler={formCleanHandler}
      form={formFields}
      loading={updateApi?.isPending || postApi?.isPending}
      handleSubmit={form.handleSubmit}
      submitHandler={onSubmit}
      label={label}
    />
  )

  const { columns } = useColumn({
    editHandler,
    isPending: deleteApi?.isPending || false,
    deleteHandler,
    formChildren,
  })

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Permissions List'
          >
            {formChildren}
          </RTable>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

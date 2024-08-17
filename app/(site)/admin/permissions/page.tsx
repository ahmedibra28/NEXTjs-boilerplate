'use client'

import useDataStore from '@/zustand/dataStore'
import React, { useEffect, useState } from 'react'
import type { Permission as IPermission } from '@prisma/client'
import { FormSchema } from './components/schema'
import CustomFormField from '@/components/custom-form'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import FormView from '@/components/form-view'
import DataTable from '@/components/data-table'
import { useColumns } from './components/columns'
import { useDebounce } from '@uidotdev/usehooks'
import { TopLoadingBar } from '@/components/top-loading-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Skeleton from '@/components/skeleton'
import ApiCall from '@/services/api'

export default function Page() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { toast } = useToast()

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const getApi = ApiCall({
    key: ['permissions'],
    method: 'GET',
    url: `permissions?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = ApiCall({
    key: ['permissions'],
    method: 'POST',
    url: `permissions`,
  })?.post

  const updateApi = ApiCall({
    key: ['permissions'],
    method: 'PUT',
    url: `permissions`,
  })?.put

  const deleteApi = ApiCall({
    key: ['permissions'],
    method: 'DELETE',
    url: `permissions`,
  })?.delete

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
      setDialogOpen(false)
      toast({
        title: 'Success!',
        description:
          deleteApi?.data?.message ||
          updateApi?.data?.message ||
          postApi?.data?.message,
        action: <ToastAction altText='Done'>Done</ToastAction>,
        variant: 'default',
      })
    }

    // eslint-disable-next-line
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    if (
      postApi?.isError ||
      updateApi?.isError ||
      deleteApi?.isError ||
      getApi?.isError
    ) {
      toast({
        title: 'Error!',
        description:
          deleteApi?.error ||
          updateApi?.error ||
          postApi?.error ||
          getApi?.error,
        action: <ToastAction altText='Done'>Done</ToastAction>,
        variant: 'destructive',
      })
    }

    // eslint-disable-next-line
  }, [
    postApi?.isError,
    updateApi?.isError,
    deleteApi?.isError,
    getApi?.isError,
  ])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  const [search] = useDebounce(q, 2000)

  useEffect(() => {
    getApi?.refetch()
    setPage(1)
    // eslint-disable-next-line
  }, [search])

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const deleteHandler = (id: any) => {
    deleteApi?.mutateAsync(id)
  }

  const methods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      method: '',
      route: '',
      description: '',
    },
  })

  const editHandler = (item: IPermission) => {
    setId(item.id!)
    setEdit(true)
    setDialogOpen(true)
    form.setValue('name', item?.name)
    form.setValue('description', item?.description || '')
    form.setValue('method', item?.method)
    form.setValue('route', item?.route)
  }

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  const { columns } = useColumns({ editHandler, deleteHandler })

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
        fieldType='select'
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

  return (
    <div>
      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label='Permission'
        edit={edit}
      />

      {getApi?.isPending ? (
        <Skeleton />
      ) : (
        <>
          <Card className='mt-2'>
            <CardHeader>
              <CardTitle className='text-sm md:text-base'>
                List of Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={(getApi?.data as any) || { data: [] }}
                setLimit={setLimit}
                limit={limit}
                setPage={setPage}
                setQ={setQ}
                search='name'
                isPending={getApi?.isPending}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

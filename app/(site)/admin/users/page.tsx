'use client'

import useDataStore from '@/zustand/dataStore'
import React, { useEffect, useState } from 'react'
import type { User as IUser } from '@/prisma/generated/client'
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
import { useRouter } from 'next/navigation'
import useAuthorization from '@/hooks/useAuthorization'

export default function Page() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { toast } = useToast()

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const path = useAuthorization()
  const router = useRouter()
  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = ApiCall({
    key: ['users'],
    method: 'GET',
    url: `users?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = ApiCall({
    key: ['users'],
    method: 'POST',
    url: `users`,
  })?.post

  const updateApi = ApiCall({
    key: ['users'],
    method: 'PUT',
    url: `users`,
  })?.put

  const deleteApi = ApiCall({
    key: ['users'],
    method: 'DELETE',
    url: `users`,
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
      password: '',
      confirmPassword: '',
      status: '',
    },
  })

  const editHandler = (item: IUser & { role: { id: string } }) => {
    setId(item.id!)
    setEdit(true)
    setDialogOpen(true)
    form.setValue('status', item?.status)
    form.setValue('name', item?.name)
    form.setValue('email', item?.email)
    form.setValue('roleId', item?.role?.id!)
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
        name='email'
        label='Email'
        placeholder='Email'
        type='email'
      />
      <CustomFormField
        form={form}
        name='roleId'
        label='Role'
        placeholder='Role'
        fieldType='command'
        data={[]}
        key='roles'
        url='roles?page=1&limit=10'
      />
      <CustomFormField
        form={form}
        name='password'
        label='Password'
        placeholder='Password'
        type='password'
      />
      <CustomFormField
        form={form}
        name='confirmPassword'
        label='Confirm Password'
        placeholder='Confirm password'
        type='password'
      />
      <CustomFormField
        form={form}
        name='status'
        label='Status'
        placeholder='Status'
        fieldType='select'
        data={[
          {
            value: 'ACTIVE',
            label: 'Active',
          },
          {
            value: 'PENDING_VERIFICATION',
            label: 'Pending Verification',
          },
          {
            value: 'INACTIVE',
            label: 'Inactive',
          },
        ]}
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
        label='User'
        edit={edit}
      />

      {getApi?.isPending ? (
        <Skeleton />
      ) : (
        <>
          <Card className='mt-2'>
            <CardHeader>
              <CardTitle className='text-sm md:text-base'>
                List of Users
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

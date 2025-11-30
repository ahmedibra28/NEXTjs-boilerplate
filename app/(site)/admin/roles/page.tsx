'use client'

import useDataStore from '@/zustand/dataStore'
import React, { useEffect, useState } from 'react'
import type {
  Permission as IPermission,
  ClientPermission as IClientPermission,
} from '@/prisma/generated/client'
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
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { toast } = useToast()

  const { dialogOpen, setDialogOpen, setData } = useDataStore((state) => state)

  const path = useAuthorization()
  const router = useRouter()
  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = ApiCall({
    key: ['roles'],
    method: 'GET',
    url: `roles?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = ApiCall({
    key: ['roles'],
    method: 'POST',
    url: `roles`,
  })?.post

  const updateApi = ApiCall({
    key: ['roles'],
    method: 'PUT',
    url: `roles`,
  })?.put

  const deleteApi = ApiCall({
    key: ['roles'],
    method: 'DELETE',
    url: `roles`,
  })?.delete

  const getClientPermissionsApi = ApiCall({
    key: ['client-permissions'],
    method: 'GET',
    url: `client-permissions?page=${page}&q=${q}&limit=${300}`,
  })?.get

  const getPermissionsApi = ApiCall({
    key: ['permissions'],
    method: 'GET',
    url: `permissions?page=${page}&q=${q}&limit=${300}`,
  })?.get

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

  const search = useDebounce(q, 2000)

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
      getClientPermissionsApi?.refetch()
      getPermissionsApi?.refetch()
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  interface CheckboxListItem {
    label: string
    children: Array<{
      id: string
      label: string
      method?: string
      path?: string
    }>
  }

  const permissionsList = (items: IPermission[]): CheckboxListItem[] =>
    items?.reduce((acc: CheckboxListItem[], curr: IPermission) => {
      const found = acc.find((item) => item.label === curr.name)
      if (found) {
        found.children.push({
          id: curr.id,
          label: curr.description || '',
          method: curr.method,
        })
      } else {
        acc.push({
          label: curr.name,
          children: [
            {
              id: curr.id,
              label: curr.description || '',
              method: curr.method,
            },
          ],
        })
      }
      return acc
    }, [])

  const clientPermissionsList = (
    items: IClientPermission[]
  ): CheckboxListItem[] =>
    items?.reduce((acc: CheckboxListItem[], curr: IClientPermission) => {
      const found = acc.find((item) => item.label === curr.menu)
      if (found) {
        found.children.push({
          id: curr.id,
          label: curr.description || '',
          path: curr.path,
        })
      } else {
        acc.push({
          label: curr.menu,
          children: [
            {
              id: curr.id,
              label: curr.description || '',
              path: curr.path,
            },
          ],
        })
      }
      return acc
    }, [])

  const deleteHandler = (id: any) => {
    deleteApi?.mutateAsync(id)
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
      clientPermissions: [],
    },
  })

  const editHandler = (
    item: IClientPermission & {
      role: { id: string }
      permissions: IPermission[]
      clientPermissions: IClientPermission[]
    }
  ) => {
    setId(item.id!)
    setEdit(true)
    setDialogOpen(true)

    form.setValue('name', item?.name)
    form.setValue('description', item?.description || '')

    form.setValue(
      'permissions',
      item?.permissions?.map((item) => item?.id)
    )
    form.setValue(
      'clientPermissions',
      item?.clientPermissions?.map((item) => item?.id)
    )
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

  useEffect(() => {
    getClientPermissionsApi?.isSuccess &&
      setData({
        id: 'clientPermissions',
        data: clientPermissionsList(getClientPermissionsApi?.data?.data || []),
      })

    getPermissionsApi?.isSuccess &&
      setData({
        id: 'permissions',
        data: permissionsList(getPermissionsApi?.data?.data || []),
      })
    // eslint-disable-next-line
  }, [getClientPermissionsApi?.isSuccess, getPermissionsApi?.isSuccess])

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
        label='Permission'
        name='permissions'
        placeholder='Permission'
        fieldType='multipleCheckbox'
        data={[]}
      />
      <CustomFormField
        form={form}
        name='description'
        label='Description'
        placeholder='Description'
        cols={3}
        rows={3}
      />
      <CustomFormField
        form={form}
        label='Client Permission'
        name='clientPermissions'
        placeholder='Client Permission'
        fieldType='multipleCheckbox'
        data={[]}
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
        label='Role'
        edit={edit}
        height='h-[80vh]'
      />

      {getApi?.isPending ? (
        <Skeleton />
      ) : (
        <>
          <Card className='mt-2'>
            <CardHeader>
              <CardTitle className='text-sm md:text-base'>
                List of Roles
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
                q={q}
                isPending={getApi?.isPending}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

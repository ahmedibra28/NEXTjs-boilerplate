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
import type { User as IUser } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import useEditStore from '@/zustand/editStore'
import { useColumn } from './hook/useColumn'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useResetStore from '@/zustand/resetStore'

const FormSchema = z
  .object({
    name: z.string().refine((value) => value !== '', {
      message: 'Name is required',
    }),
    email: z
      .string()
      .email()
      .refine((value) => value !== '', {
        message: 'Email is required',
      }),
    roleId: z.string().refine((value) => value !== '', {
      message: 'Role is required',
    }),
    confirmed: z.boolean(),
    blocked: z.boolean(),
    password: z.string().refine((val) => val.length === 0 || val.length > 6, {
      message: "Password can't be less than 6 characters",
    }),
    confirmPassword: z
      .string()
      .refine((val) => val.length === 0 || val.length > 6, {
        message: "Confirm password can't be less than 6 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  })

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const { edit, setEdit } = useEditStore((state) => state)
  const [q, setQ] = useState('')

  const { reset, setReset } = useResetStore((state) => state)

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
      password: '',
      confirmPassword: '',
      confirmed: false,
      blocked: false,
    },
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
      setReset(!reset)
      window.document.getElementById('dialog-close')?.click()
    }
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

  const refEdit = React.useRef(edit)
  const refId = React.useRef(id)

  const editHandler = (item: IUser & { role: { id: string } }) => {
    setId(item.id!)
    setEdit(true)

    refEdit.current = true
    refId.current = item.id!
    form.setValue('blocked', Boolean(item?.blocked))
    form.setValue('confirmed', Boolean(item?.confirmed))
    form.setValue('name', item?.name)
    form.setValue('email', item?.email)
    form.setValue('roleId', item?.role?.id!)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'User'
  const modal = 'user'

  useEffect(() => {
    form.reset()
    setEdit(false)
    setId(null)
    refEdit.current = false
    refId.current = null
    // eslint-disable-next-line
  }, [reset])

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
        name='confirmed'
        label='Confirmed'
        placeholder='Confirmed'
        fieldType='switch'
      />
      <CustomFormField
        form={form}
        name='blocked'
        label='Blocked'
        placeholder='Blocked'
        fieldType='switch'
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
            caption='Users List'
          >
            {formChildren}
          </RTable>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useUsersHook from '../../../utils/api/users'
import { Spinner, Pagination, Message, Confirm } from '../../../components'
import {
  inputCheckBox,
  inputEmail,
  inputPassword,
  inputText,
} from '../../../utils/dynamicForm'
import TableView from '../../../components/TableView'
import FormView from '../../../components/FormView'

const Users = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { getUsers, postUser, updateUser, deleteUser } = useUsersHook({
    page,
    q,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      confirmed: true,
      blocked: false,
    },
  })

  const { data, isLoading, isError, error, refetch } = getUsers

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updateUser

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteUser

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postUser

  useEffect(() => {
    if (isSuccessPost || isSuccessUpdate) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPost, isSuccessUpdate])

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e) => {
    e.preventDefault()
    refetch()
    setPage(1)
  }

  // TableView
  const table = {
    header: ['Name', 'Email'],
    body: ['name', 'email'],
    createdAt: 'createdAt',
    confirmed: 'confirmed',
    blocked: 'blocked',
    data: data,
  }

  const editHandler = (item) => {
    setId(item._id)

    table.body.map((t) => setValue(t, item[t]))
    setEdit(true)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'Users List'
  const label = 'User'
  const modal = 'user'
  const searchPlaceholder = 'Search by email'

  // FormView
  const formCleanHandler = () => {
    reset(), setEdit(false)
  }

  const submitHandler = (data) => {
    edit
      ? mutateAsyncUpdate({
          _id: id,
          name: data.name,
          email: data.email,
          confirmed: data.confirmed,
          blocked: data.blocked,
          password: data.password,
        })
      : mutateAsyncPost(data)
  }

  const form = [
    inputText({
      register,
      errors,
      label: 'Name',
      name: 'name',
      placeholder: 'Enter name',
    }),
    inputEmail({
      register,
      errors,
      label: 'Email',
      name: 'email',
      placeholder: 'Enter email address',
    }),
    inputPassword({
      register,
      errors,
      label: 'Password',
      name: 'password',
      placeholder: 'Enter password',
      isRequired: false,
    }),
    inputPassword({
      register,
      errors,
      label: 'Confirm Password',
      name: 'confirmPassword',
      placeholder: 'Enter confirm password',
      isRequired: false,
    }),

    inputCheckBox({
      register,
      errors,
      label: 'Confirmed',
      name: 'confirmed',
      isRequired: false,
    }),
    inputCheckBox({
      register,
      errors,
      label: 'Blocked',
      name: 'blocked',
      isRequired: false,
    }),
  ]

  const row = false
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-md'

  return (
    <>
      <Head>
        <title>Users</title>
        <meta property='og:title' content='Users' key='title' />
      </Head>

      {isSuccessDelete && (
        <Message variant='success'>
          {label} has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          {label} has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessPost && (
        <Message variant='success'>
          {label} has been Created successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        watch={watch}
        isLoadingUpdate={isLoadingUpdate}
        isLoadingPost={isLoadingPost}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        column={column}
        row={row}
        modalSize={modalSize}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <TableView
          table={table}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          searchHandler={searchHandler}
          isLoadingDelete={isLoadingDelete}
          name={name}
          label={label}
          modal={modal}
          setQ={setQ}
          q={q}
          searchPlaceholder={searchPlaceholder}
          searchInput={true}
          addBtn={true}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Users)), { ssr: false })

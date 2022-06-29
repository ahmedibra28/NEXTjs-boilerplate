import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useUserRolesHook from '../../../utils/api/userRoles'
import { Spinner, Pagination, Message, Confirm } from '../../../components'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import TableView from '../../../components/TableView'
import FormView from '../../../components/FormView'
import useRolesHook from '../../../utils/api/roles'
import useUsersHook from '../../../utils/api/users'

const UserRoles = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { getUserRoles, postUserRole, updateUserRole, deleteUserRole } =
    useUserRolesHook({
      page,
      q,
    })
  const { getRoles } = useRolesHook({
    limit: 100000,
    page: 1,
  })

  const { getUsers } = useUsersHook({
    limit: 100000,
    page: 1,
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
      auth: true,
    },
  })

  const { data, isLoading, isError, error, refetch } = getUserRoles
  const { data: dataRoles } = getRoles
  const { data: dataUsers } = getUsers

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updateUserRole

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteUserRole

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postUserRole

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
    header: ['Name', 'Email', 'Role', 'Role Type'],
    body: ['role.name', 'user.email', 'role.name', 'role.type'],
    createdAt: 'createdAt',
    data: data,
  }

  const editHandler = (item) => {
    setId(item._id)

    setEdit(true)
    setValue('user', item?.user?._id)
    setValue('role', item?.role?._id)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'User Roles List'
  const label = 'User Role'
  const modal = 'userRole'
  const searchPlaceholder = 'Search by name'

  // FormView
  const formCleanHandler = () => {
    reset(), setEdit(false)
  }

  const submitHandler = (data) => {
    edit
      ? mutateAsyncUpdate({
          _id: id,
          user: data.user,
          role: data.role,
        })
      : mutateAsyncPost(data)
  }

  const form = [
    dynamicInputSelect({
      register,
      errors,
      label: 'User',
      name: 'user',
      placeholder: 'User',
      value: 'name',
      data:
        dataUsers &&
        dataUsers.data &&
        dataUsers.data.filter((user) => user.confirmed && !user.blocked),
      placeholder: 'User',
    }),

    dynamicInputSelect({
      register,
      errors,
      label: 'Role',
      name: 'role',
      placeholder: 'Role',
      data: dataRoles && dataRoles.data,
      placeholder: 'Role',
      value: 'name',
    }),
  ]

  const row = false
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-md'

  return (
    <>
      <Head>
        <title>User Roles</title>
        <meta property='og:title' content='User Roles' key='title' />
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

export default dynamic(() => Promise.resolve(withAuth(UserRoles)), {
  ssr: false,
})

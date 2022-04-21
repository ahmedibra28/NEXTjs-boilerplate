import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useUserRolesHook from '../../../utils/api/userRoles'
import useRolesHook from '../../../utils/api/roles'
import useUsersHook from '../../../utils/api/users'
import {
  Spinner,
  ViewUserRoles,
  Pagination,
  FormUserRoles,
  Message,
  Confirm,
} from '../../../components'

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

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

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

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
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

  const editHandler = (userRole) => {
    setId(userRole._id)
    setEdit(true)
    setValue('user', userRole.user && userRole.user._id)
    setValue('role', userRole.role && userRole.role._id)
  }

  return (
    <>
      <Head>
        <title>UserRoles</title>
        <meta property='og:title' content='UserRoles' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>
          UserRole has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          UserRole has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessPost && (
        <Message variant='success'>
          UserRole has been Created successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <FormUserRoles
        edit={edit}
        formCleanHandler={formCleanHandler}
        isLoading={isLoading}
        isError={isError}
        errors={errors}
        isLoadingUpdate={isLoadingUpdate}
        isLoadingPost={isLoadingPost}
        register={register}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        watch={watch}
        error={error}
        dataRoles={dataRoles}
        dataUsers={dataUsers}
      />

      <div className='ms-auto text-end'>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <ViewUserRoles
          data={data}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          isLoadingDelete={isLoadingDelete}
          setQ={setQ}
          q={q}
          searchHandler={searchHandler}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(UserRoles)), {
  ssr: false,
})

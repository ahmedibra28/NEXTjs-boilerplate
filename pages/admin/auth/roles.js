import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useRolesHook from '../../../utils/api/roles'
import usePermissionsHook from '../../../utils/api/permissions'
import useClientPermissionsHook from '../../../utils/api/clientPermissions'
import {
  Spinner,
  ViewRoles,
  Pagination,
  FormRoles,
  Message,
  Confirm,
} from '../../../components'

const Roles = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { getRoles, postRole, updateRole, deleteRole } = useRolesHook({
    page,
    q,
  })
  const { getPermissions } = usePermissionsHook({
    limit: 1000000,
  })
  const { getClientPermissions } = useClientPermissionsHook({
    limit: 1000000,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { data, isLoading, isError, error, refetch } = getRoles
  const { data: permissionData } = getPermissions
  const { data: clientPermissionData } = getClientPermissions

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updateRole

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteRole

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postRole

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
          name: data.name,
          description: data.description,
          permission: data.permission,
          clientPermission: data.clientPermission,
        })
      : mutateAsyncPost(data)
  }

  const editHandler = (role) => {
    setId(role._id)
    setEdit(true)
    setValue('name', role.name)
    setValue('description', role.description)
    setValue(
      'permission',
      role.permission && role.permission.map((item) => item._id)
    )
    setValue(
      'clientPermission',
      role.clientPermission && role.clientPermission.map((item) => item._id)
    )
  }

  return (
    <>
      <Head>
        <title>Roles</title>
        <meta property='og:title' content='Roles' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>Role has been deleted successfully.</Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>Role has been updated successfully.</Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessPost && (
        <Message variant='success'>Role has been Created successfully.</Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <FormRoles
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
        permissionData={permissionData && permissionData.data}
        clientPermissionData={clientPermissionData && clientPermissionData.data}
      />

      <div className='ms-auto text-end'>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <ViewRoles
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

export default dynamic(() => Promise.resolve(withAuth(Roles)), {
  ssr: false,
})

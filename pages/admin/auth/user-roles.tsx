import { useState, useEffect, FormEvent } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useUserRolesHook from '../../../utils/api/userRoles'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
} from '../../../components'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import FormView from '../../../components/FormView'
import useRolesHook from '../../../utils/api/roles'
import useUsersHook from '../../../utils/api/users'
import moment from 'moment'
import { FaPenAlt, FaTrash } from 'react-icons/fa'

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

  const searchHandler = (e: FormEvent) => {
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
  interface Item {
    _id: string
    user: { _id: string; name: string; email: string }
    role: { _id: string; name: string; type: string }
    createdAt: string
  }
  const editHandler = (item: Item) => {
    setId(item._id)

    setEdit(true)
    setValue('user' as any, item?.user?._id)
    setValue('role' as any, item?.role?._id)
  }

  const deleteHandler = (id: string) => {
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
          ...data,
        })
      : mutateAsyncPost(data)
  }

  const form = [
    <div key={0} className='col-12'>
      {dynamicInputSelect({
        register,
        errors,
        label: 'User',
        name: 'user',
        placeholder: 'User',
        value: 'name',
        data:
          dataUsers &&
          dataUsers.data &&
          dataUsers.data.filter(
            (user: { confirmed: boolean; blocked: boolean }) =>
              user.confirmed && !user.blocked
          ),
      })}
    </div>,

    <div key={1} className='col-12'>
      {dynamicInputSelect({
        register,
        errors,
        label: 'Role',
        name: 'role',
        placeholder: 'Role',
        data: dataRoles && dataRoles.data,
        value: 'name',
      })}
    </div>,
  ]

  const modalSize = 'modal-lg'

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
        isLoadingUpdate={isLoadingUpdate}
        isLoadingPost={isLoadingPost}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        modalSize={modalSize}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className='table-responsive bg-light p-3 mt-2'>
          <div className='d-flex align-items-center flex-column mb-2'>
            <h3 className='fw-light text-muted'>
              {name}
              <sup className='fs-6'> [{table?.data?.total}] </sup>
            </h3>
            <button
              className='btn btn-outline-primary btn-sm shadow my-2'
              data-bs-toggle='modal'
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
            <div className='col-auto'>
              <Search
                placeholder='Search by name'
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className='table table-sm table-border'>
            <thead className='border-0'>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Role Type</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item: Item) => (
                <tr key={item?._id}>
                  <td>{item?.user?.name}</td>
                  <td>{item?.user?.email}</td>
                  <td>{item?.role?.name}</td>
                  <td>{item?.role?.type}</td>

                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    <div className='btn-group'>
                      <button
                        className='btn btn-primary btn-sm rounded-pill'
                        onClick={() => editHandler(item)}
                        data-bs-toggle='modal'
                        data-bs-target={`#${modal}`}
                      >
                        <FaPenAlt />
                      </button>

                      <button
                        className='btn btn-danger btn-sm ms-1 rounded-pill'
                        onClick={() => deleteHandler(item._id)}
                        disabled={isLoadingDelete}
                      >
                        {isLoadingDelete ? (
                          <span className='spinner-border spinner-border-sm' />
                        ) : (
                          <span>
                            <FaTrash />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(UserRoles)), {
  ssr: false,
})

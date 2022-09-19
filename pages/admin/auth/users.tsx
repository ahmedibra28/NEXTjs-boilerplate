import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useUsersHook from '../../../utils/api/users'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
} from '../../../components'
import {
  inputCheckBox,
  inputEmail,
  inputPassword,
  inputText,
} from '../../../utils/dynamicForm'
import FormView from '../../../components/FormView'
import { FaCheckCircle, FaPenAlt, FaTimesCircle, FaTrash } from 'react-icons/fa'
import moment from 'moment'

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

  interface Item {
    _id: string
    name: string
    email: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
  }
  const editHandler = (item: Item) => {
    setId(item._id)

    table.body.map((t) => setValue(t as any, item[t]))
    setEdit(true)
  }

  const deleteHandler = (id: string) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'Users List'
  const label = 'User'
  const modal = 'user'

  // FormView
  const formCleanHandler = () => {
    reset(), setEdit(false)
  }

  const submitHandler = (data: object) => {
    edit
      ? mutateAsyncUpdate({
          _id: id,
          ...data,
        })
      : mutateAsyncPost(data)
  }

  const form = [
    <div key={0} className='col-12'>
      {inputText({
        register,
        errors,
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
      })}
    </div>,
    <div key={1} className='col-12'>
      {inputEmail({
        register,
        errors,
        label: 'Email',
        name: 'email',
        placeholder: 'Enter email address',
      })}
    </div>,
    <div key={2} className='col-lg-6 col-md-6 col-12'>
      {inputPassword({
        register,
        errors,
        label: 'Password',
        name: 'password',
        placeholder: 'Enter password',
        isRequired: false,
      })}
    </div>,
    <div key={3} className='col-lg-6 col-md-6 col-12'>
      {inputPassword({
        register,
        errors,
        label: 'Confirm Password',
        name: 'confirmPassword',
        placeholder: 'Enter confirm password',
        isRequired: false,
      })}
    </div>,

    <div key={4} className='col-12'>
      {inputCheckBox({
        register,
        errors,
        label: 'Confirmed',
        name: 'confirmed',
        isRequired: false,
      })}
    </div>,
    <div key={5} className='col-12'>
      {inputCheckBox({
        register,
        errors,
        label: 'Blocked',
        name: 'blocked',
        isRequired: false,
      })}
    </div>,
  ]

  const modalSize = 'modal-lg'

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
                placeholder='Search by email'
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className='table table-sm table-border'>
            <thead className='border-0'>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Confirmed</th>
                <th>Blocked</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item: Item) => (
                <tr key={item?._id}>
                  <td>{item?.name}</td>
                  <td>{item?.email}</td>
                  <td>
                    {item?.confirmed ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}
                  </td>
                  <td>
                    {item?.blocked ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}
                  </td>
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

export default dynamic(() => Promise.resolve(withAuth(Users)), { ssr: false })

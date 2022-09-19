import { useState, useEffect, FormEvent } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import usePermissionsHook from '../../../utils/api/permissions'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
} from '../../../components'
import {
  inputCheckBox,
  inputText,
  inputTextArea,
  staticInputSelect,
} from '../../../utils/dynamicForm'
import FormView from '../../../components/FormView'
import { FaCheckCircle, FaPenAlt, FaTimesCircle, FaTrash } from 'react-icons/fa'
import moment from 'moment'

const Permissions = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { getPermissions, postPermission, updatePermission, deletePermission } =
    usePermissionsHook({
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
      auth: true,
    },
  })

  const { data, isLoading, isError, error, refetch } = getPermissions

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updatePermission

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deletePermission

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postPermission

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
    header: ['Name', 'Method', 'Route'],
    body: ['name', 'method', 'route'],
    createdAt: 'createdAt',
    auth: 'auth',
    data: data,
  }

  interface Item {
    _id: string
    name: string
    method: string
    route: string
    auth: boolean
    createdAt: string
    description: string
  }
  const editHandler = (item: Item) => {
    setId(item._id)

    table.body.map((t) => setValue(t as any, item[t]))
    setValue('description' as any, item.description)
    setEdit(true)
  }

  const deleteHandler = (id: string) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'Permissions List'
  const label = 'Permission'
  const modal = 'permission'

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
    <div key={0} className='col-lg-6 col-md-6 col-12'>
      {inputText({
        register,
        errors,
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
      })}
    </div>,
    <div key={1} className='col-lg-6 col-md-6 col-12'>
      {staticInputSelect({
        register,
        errors,
        label: 'Method',
        name: 'method',
        placeholder: 'Method',
        data: [
          { name: 'GET' },
          { name: 'POST' },
          { name: 'PUT' },
          { name: 'DELETE' },
        ],
      })}
    </div>,
    <div key={2} className='col-12'>
      {inputText({
        register,
        errors,
        label: 'Route',
        name: 'route',
        placeholder: 'Route',
      })}
    </div>,
    <div key={3} className='col-12'>
      {inputTextArea({
        register,
        errors,
        label: 'Description',
        name: 'description',
        placeholder: 'Description',
      })}
    </div>,
    <div key={4} className='col-12'>
      {inputCheckBox({
        register,
        errors,
        watch,
        name: 'auth',
        label: 'Auth',
        isRequired: false,
        placeholder: 'Auth',
      })}
    </div>,
  ]

  const modalSize = 'modal-lg'

  return (
    <>
      <Head>
        <title>Permissions</title>
        <meta property='og:title' content='Permissions' key='title' />
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
                <th>Name</th>
                <th>Method</th>
                <th>Route</th>
                <th>Auth</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item: Item) => (
                <tr key={item?._id}>
                  <td>{item?.name}</td>
                  <td>
                    {item?.method === 'GET' ? (
                      <div className='badge rounded-0s bg-success'>
                        {item?.method}
                      </div>
                    ) : item?.method === 'POST' ? (
                      <div className='badge rounded-0s bg-primary'>
                        {item?.method}
                      </div>
                    ) : item?.method === 'DELETE' ? (
                      <div className='badge rounded-0s bg-danger'>
                        {item?.method}
                      </div>
                    ) : (
                      item?.method === 'PUT' && (
                        <div className='badge rounded-0s bg-info'>
                          {item?.method}
                        </div>
                      )
                    )}
                  </td>
                  <td>{item?.route}</td>
                  <td>
                    {item?.auth ? (
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

export default dynamic(() => Promise.resolve(withAuth(Permissions)), {
  ssr: false,
})

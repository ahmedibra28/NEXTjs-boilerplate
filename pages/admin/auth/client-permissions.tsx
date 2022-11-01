import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
} from '../../../components'
import {
  inputNumber,
  inputText,
  inputTextArea,
} from '../../../utils/dynamicForm'
import FormView from '../../../components/FormView'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../../api'

const ClientPermissions = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      auth: true,
    },
  })

  const getApi = apiHook({
    key: ['client-permissions'],
    method: 'GET',
    url: `auth/client-permissions?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['client-permissions'],
    method: 'POST',
    url: `auth/client-permissions`,
  })?.post

  const updateApi = apiHook({
    key: ['client-permissions'],
    method: 'PUT',
    url: `auth/client-permissions`,
  })?.put

  const deleteApi = apiHook({
    key: ['client-permissions'],
    method: 'DELETE',
    url: `auth/client-permissions`,
  })?.deleteObj

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      formCleanHandler()
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  // TableView
  const table = {
    header: ['Sort By', 'Name', 'Menu', 'Path', 'Description'],
    body: ['sort', 'name', 'menu', 'path', 'description'],
    createdAt: 'createdAt',
    data: getApi?.data,
  }

  interface Item {
    _id: string
    name: string
    menu: string
    sort: number
    path: string
    description: string
    createdAt: string
  }
  const editHandler = (item: Item) => {
    setId(item._id)

    table.body.map((t) => setValue(t as any, item[t]))
    setEdit(true)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Client Permissions List'
  const label = 'Client Permission'
  const modal = 'clientPermission'

  // FormView
  const formCleanHandler = () => {
    reset(), setEdit(false)
  }

  const submitHandler = (data) => {
    edit
      ? updateApi?.mutateAsync({
          _id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={0} className='col-lg-6 col-md-6 col-12'>
      {inputText({
        register,
        errors,
        label: 'Name',
        name: 'name',
        placeholder: 'Name',
      })}
    </div>,
    <div key={1} className='col-lg-6 col-md-6 col-12'>
      {inputText({
        register,
        errors,
        label: 'Menu',
        name: 'menu',
        placeholder: 'Menu',
      })}
    </div>,
    <div key={2} className='col-lg-6 col-md-6 col-12'>
      {inputNumber({
        register,
        errors,
        label: 'Sort By',
        name: 'sort',
        placeholder: 'Sort by',
      })}
    </div>,
    <div key={3} className='col-lg-6 col-md-6 col-12'>
      {inputText({
        register,
        errors,
        label: 'Path',
        name: 'path',
        placeholder: 'Path',
      })}
    </div>,
    <div key={4} className='col-12'>
      {inputTextArea({
        register,
        errors,
        label: 'Description',
        name: 'description',
        placeholder: 'Description',
        isRequired: false,
      })}
    </div>,
  ]

  const modalSize = 'modal-lg'

  return (
    <>
      <Head>
        <title>Client Permissions</title>
        <meta property='og:title' content='Client Permissions' key='title' />
      </Head>

      {deleteApi?.isSuccess && (
        <Message variant='success'>
          {label} has been deleted successfully.
        </Message>
      )}
      {deleteApi?.isError && (
        <Message variant='danger'>{deleteApi?.error}</Message>
      )}
      {updateApi?.isSuccess && (
        <Message variant='success'>
          {label} has been updated successfully.
        </Message>
      )}
      {updateApi?.isError && (
        <Message variant='danger'>{updateApi?.error}</Message>
      )}
      {postApi?.isSuccess && (
        <Message variant='success'>
          {label} has been Created successfully.
        </Message>
      )}
      {postApi?.isError && <Message variant='danger'>{postApi?.error}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isLoading}
        isLoadingPost={postApi?.isLoading}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        modalSize={modalSize}
      />

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant='danger'>{getApi?.error}</Message>
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
                <th>Sort By</th>
                <th>Name</th>
                <th>Menu</th>
                <th>Path</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: Item) => (
                <tr key={item?._id}>
                  <td>{item?.sort}</td>
                  <td>{item?.name}</td>
                  <td>{item?.menu}</td>
                  <td>{item?.path}</td>
                  <td>{item?.description}</td>
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
                        disabled={deleteApi?.isLoading}
                      >
                        {deleteApi?.isLoading ? (
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

export default dynamic(() => Promise.resolve(withAuth(ClientPermissions)), {
  ssr: false,
})

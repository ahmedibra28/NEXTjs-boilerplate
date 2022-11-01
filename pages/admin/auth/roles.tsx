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
  inputMultipleCheckBox,
  inputText,
  inputTextArea,
} from '../../../utils/dynamicForm'
import FormView from '../../../components/FormView'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../../api'

const Roles = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['roles'],
    method: 'GET',
    url: `auth/roles?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['roles'],
    method: 'POST',
    url: `auth/roles`,
  })?.post

  const updateApi = apiHook({
    key: ['roles'],
    method: 'PUT',
    url: `auth/roles`,
  })?.put

  const deleteApi = apiHook({
    key: ['roles'],
    method: 'DELETE',
    url: `auth/roles`,
  })?.deleteObj

  const getClientPermissionsApi = apiHook({
    key: ['client-permissions'],
    method: 'GET',
    url: `auth/client-permissions?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const getPermissionsApi = apiHook({
    key: ['permissions'],
    method: 'GET',
    url: `auth/permissions?page=${page}&q=${q}&limit=${25}`,
  })?.get

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

  const uniquePermissions = [
    ...(new Set(
      getPermissionsApi?.data?.data?.map((item: { name: string }) => item.name)
    ) as any),
  ]?.map((group) => ({
    [group]: getPermissionsApi?.data?.data?.filter(
      (permission: { name: string }) => permission?.name === group
    ),
  }))

  const uniqueClientPermissions = [
    ...(new Set(
      getClientPermissionsApi?.data?.data?.map(
        (item: { menu: string }) => item.menu
      )
    ) as any),
  ]?.map((group) => ({
    [group]: getClientPermissionsApi?.data?.data?.filter(
      (clientPermission: { menu: string }) => clientPermission?.menu === group
    ),
  }))

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

  const searchHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  // TableView
  const table = {
    header: ['Name', 'Type', 'Description'],
    body: ['name', 'type', 'description'],
    createdAt: 'createdAt',
    data: getApi?.data,
  }

  interface Item {
    _id: string
    name: string
    type: string
    description: string
    createdAt: string
    permission: any[]
    clientPermission: any[]
  }
  const editHandler = (item: Item) => {
    setId(item._id)

    table.body.map((t) => setValue(t as any, item[t]))
    setEdit(true)

    const permission = [
      ...(new Set(item?.permission?.map((item) => item.name)) as any),
    ]
      ?.map((group) => ({
        [group]: item?.permission?.filter(
          (permission) => permission?.name === group
        ),
      }))
      ?.map((per) => {
        setValue(
          `permission-${Object.keys(per)[0]}` as any,
          Object.values(per)[0]?.map((per: { _id: string }) => per?._id)
        )
      })

    const clientPermission = [
      ...(new Set(
        item.clientPermission?.map((item: { menu: string }) => item.menu)
      ) as any),
    ]
      ?.map((group) => ({
        [group]: item?.clientPermission?.filter(
          (clientPermission: { menu: any }) => clientPermission?.menu === group
        ),
      }))
      ?.map((per) => {
        setValue(
          `clientPermission-${Object.keys(per)[0]}` as any,
          Object.values(per)[0]?.map((p: any) => p?._id)
        )
      })
  }

  const deleteHandler = (id: string) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Roles List'
  const label = 'Role'
  const modal = 'role'

  // FormView
  const formCleanHandler = () => {
    reset(), setEdit(false)
  }

  const submitHandler = (data: {
    [x: string]: any
    name?: any
    description?: any
  }) => {
    const permission = Object.keys(data)
      .filter((key) => key.startsWith('permission-'))
      ?.map((key) => data[key])
      ?.filter((value) => value)
      ?.join(',')
      .split(',')

    const clientPermission = Object.keys(data)
      .filter((key) => key.startsWith('clientPermission-'))
      ?.map((key) => data[key])
      ?.filter((value) => value)
      ?.join(',')
      .split(',')

    edit
      ? updateApi?.mutateAsync({
          _id: id,
          name: data.name,
          permission,
          clientPermission,
          description: data.description,
        })
      : postApi?.mutateAsync({
          _id: id,
          name: data.name,
          permission,
          clientPermission,
          description: data.description,
        })
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
      {uniquePermissions?.length > 0 &&
        uniquePermissions?.map((g, i) => (
          <div key={i} className='mb-1'>
            <label className='fw-bold text-uppercase'>
              {uniquePermissions?.length > 0 && Object.keys(g)[0]}
            </label>

            {inputMultipleCheckBox({
              register,
              errors,
              label: `${uniquePermissions?.length > 0 && Object.keys(g)[0]}`,
              name: `permission-${
                uniquePermissions?.length > 0 && Object.keys(g)[0]
              }`,
              placeholder: `${
                uniquePermissions?.length > 0 && Object.keys(g)[0]
              }`,
              data:
                uniquePermissions?.length > 0 &&
                Object.values(g)[0]?.map(
                  (item: { method: any; description: any; _id: any }) => ({
                    name: `${item.method} - ${item.description}`,
                    _id: item._id,
                  })
                ),
              isRequired: false,
            })}
          </div>
        ))}
    </div>,

    <div key={2} className='col-12'>
      {inputTextArea({
        register,
        errors,
        label: 'Description',
        name: 'description',
        placeholder: 'Description',
      })}
    </div>,

    <div key={3} className='col-12'>
      {uniqueClientPermissions?.length > 0 &&
        uniqueClientPermissions?.map((g, i) => (
          <div key={i} className='mb-1'>
            <label className='fw-bold text-uppercase'>
              {uniqueClientPermissions?.length > 0 && Object.keys(g)[0]}
            </label>

            {inputMultipleCheckBox({
              register,
              errors,
              label: `${
                uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
              }`,
              name: `clientPermission-${
                uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
              }`,
              placeholder: `${
                uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
              }`,
              data:
                uniqueClientPermissions?.length > 0 &&
                Object.values(g)[0]?.map(
                  (item: { menu: any; path: any; _id: any }) => ({
                    name: `${item.menu} - ${item.path}`,
                    _id: item._id,
                  })
                ),
              isRequired: false,
            })}
          </div>
        ))}
    </div>,
  ]

  const modalSize = 'modal-lg'

  return (
    <>
      <Head>
        <title>Roles</title>
        <meta property='og:title' content='Roles' key='title' />
      </Head>

      {deleteApi?.isSuccess && (
        <Message variant='success'>
          {label} has been cancelled successfully.
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
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: Item) => (
                <tr key={item?._id}>
                  <td>{item?.name}</td>
                  <td>{item?.type}</td>
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

export default dynamic(() => Promise.resolve(withAuth(Roles)), {
  ssr: false,
})

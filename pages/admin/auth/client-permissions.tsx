import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useClientPermissionsHook from '../../../utils/api/clientPermissions'
import { Spinner, Pagination, Message, Confirm } from '../../../components'
import {
  inputNumber,
  inputText,
  inputTextArea,
} from '../../../utils/dynamicForm'
import TableView from '../../../components/TableView'
import FormView from '../../../components/FormView'

const ClientPermissions = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const {
    getClientPermissions,
    postClientPermission,
    updateClientPermission,
    deleteClientPermission,
  } = useClientPermissionsHook({
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

  const { data, isLoading, isError, error, refetch } = getClientPermissions

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updateClientPermission

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteClientPermission

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postClientPermission

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
    header: ['Sort By', 'Name', 'Menu', 'Path', 'Description'],
    body: ['sort', 'name', 'menu', 'path', 'description'],
    createdAt: 'createdAt',
    data: data,
  }

  const editHandler = (item) => {
    setId(item._id)

    table.body.map((t) => setValue(t as any, item[t]))
    setEdit(true)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'Client Permissions List'
  const label = 'Client Permission'
  const modal = 'clientPermission'
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

  const modalSize = 'modal-md'

  return (
    <>
      <Head>
        <title>Client Permissions</title>
        <meta property='og:title' content='Client Permissions' key='title' />
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

export default dynamic(() => Promise.resolve(withAuth(ClientPermissions)), {
  ssr: false,
})

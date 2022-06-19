import { useEffect, useState } from 'react'
import TableView from '../components/TableView'
import { Confirm, Message, Pagination, Spinner } from '../components'
import FormView from '../components/FormView'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import { confirmAlert } from 'react-confirm-alert'
import {
  inputCheckBox,
  inputEmail,
  inputTel,
  inputText,
  inputTextArea,
  staticInputSelect,
} from '../utils/dynamicForm'

const Test = () => {
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState(false)
  const [page, setPage] = useState(1)

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

  const refetch = () => {}

  // TableView
  const table = {
    header: ['Name', 'Email', 'Phone', 'Address', 'Status'],
    body: ['name', 'email', 'phone', 'address', 'status'],
    data: {
      startIndex: 1,
      endIndex: 2,
      count: 1,
      page: 1,
      pages: 1,
      total: 2,
      data: [
        {
          _id: 1,
          name: 'John Doe',
          email: 'john@mail.com',
          phone: '+252615301507',
          address: '123 Main St, New York, NY 12345',
          status: 'Active',
        },
        {
          _id: 2,
          name: 'Jane Doe',
          email: 'jane@mail.com',
          phone: '+252615301507',
          address: '123 Main St, New York, NY 12345',
          status: 'Inactive',
        },
      ],
    },
  }
  const editHandler = (item) => {
    table.body.map((t) => setValue(t, item[t]))
    setEdit(true)
  }
  const deleteHandler = (item) => {
    confirmAlert(
      Confirm(() =>
        // mutateAsyncDelete(item)
        console.log('delete', item)
      )
    )
  }

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

  const name = 'Users List'
  const label = 'User'
  const modal = 'user'
  const searchPlaceholder = 'Search by name'

  // FormView
  const formCleanHandler = () => {
    reset(), setEdit(false)
  }

  const submitHandler = (data) => {
    console.log({ data })
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
    inputTel({
      register,
      errors,
      label: 'Phone',
      name: 'phone',
      placeholder: 'Enter phone number',
    }),
    inputTextArea({
      register,
      errors,
      label: 'Address',
      name: 'address',
      placeholder: 'Enter address',
    }),
    staticInputSelect({
      register,
      errors,
      label: 'Status',
      name: 'status',
      placeholder: 'Enter status',
      data: [{ name: 'Active' }, { name: 'Inactive' }],
    }),
  ]
  const row = false
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-md'

  let isLoading = false
  let isError = false
  let error

  let isLoadingPost = false
  let isErrorPost = false
  let errorPost
  let isSuccessPost = false

  let isLoadingUpdate = false
  let isErrorUpdate = false
  let errorUpdate
  let isSuccessUpdate = false

  let isLoadingDelete = false
  let isErrorDelete = false
  let errorDelete
  let isSuccessDelete = false

  return (
    <div>
      <Head>
        <title>{label}</title>
        <meta property='og:title' content={label} key='title' />
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
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
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
      )}
    </div>
  )
}

export default Test

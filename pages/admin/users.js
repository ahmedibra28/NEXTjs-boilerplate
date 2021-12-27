import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import { FaPenAlt, FaPlus, FaTrash } from 'react-icons/fa'
import Pagination from '../../components/Pagination'
import useUsers from '../../api/users'
import useGroups from '../../api/groups'
import { useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import {
  dynamicInputSelect,
  inputEmail,
  inputPassword,
  inputText,
} from '../../utils/dynamicForm'
import moment from 'moment'

const Users = () => {
  const [page, setPage] = useState(1)
  const { getUsers, updateUser, addUser, deleteUser } = useUsers(page)
  const { getGroups } = useGroups()

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

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = getUsers
  const { data: groupData } = getGroups

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = updateUser

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = deleteUser

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = addUser

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  useEffect(() => {
    if (isSuccessAdd || isSuccessUpdate) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAdd, isSuccessUpdate])

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          name: data.name,
          email: data.email,
          password: data.password,
          group: data.group,
        })
      : addMutateAsync(data)
  }

  const editHandler = (user) => {
    setId(user._id)
    setEdit(true)
    setValue('name', user.name)
    setValue('email', user.email)
    setValue('group', user.group)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('users')
    }
    refetch()
  }, [page, queryClient])

  return (
    <>
      <Head>
        <title>Users</title>
        <meta property='og:title' content='Users' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>User has been deleted successfully.</Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>User has been updated successfully.</Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>User has been Created successfully.</Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}

      <div
        className='modal fade'
        id='editUserModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editUserModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editUserModalLabel'>
                {edit ? 'Edit User' : 'Add User'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {isLoading ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isError ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <form onSubmit={handleSubmit(submitHandler)}>
                  {inputText({ register, errors, label: 'Name', name: 'name' })}
                  {inputEmail({
                    register,
                    errors,
                    label: 'Email',
                    name: 'email',
                  })}
                  {inputPassword({
                    register,
                    errors,
                    label: 'Password',
                    name: 'password',
                    minLength: true,
                    isRequired: false,
                  })}

                  {inputPassword({
                    register,
                    errors,
                    watch,
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    validate: true,
                    minLength: true,
                    isRequired: false,
                  })}

                  {dynamicInputSelect({
                    register,
                    errors,
                    data: groupData && groupData,
                    name: 'group',
                    label: 'Group',
                  })}

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAdd || isLoadingUpdate}
                    >
                      {isLoadingAdd || isLoadingUpdate ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='position-relative'>
        <button
          className='btn btn-primary position-fixed rounded-3 animate__bounceIn'
          style={{
            bottom: '20px',
            right: '20px',
          }}
          data-bs-toggle='modal'
          data-bs-target='#editUserModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      <div className='row mt-2'>
        <div className='col-md-4 col-6 me-auto'>
          <h3 className='fw-light font-monospace'>Users</h3>
        </div>
        <div className='col-md-4 col-6 ms-auto text-end'>
          <Pagination data={data} setPage={setPage} />
        </div>
      </div>

      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered table-striped caption-top '>
              <caption>{data && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>Joined Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((user) => (
                    <tr key={user._id}>
                      <td>{moment(user.createdAt).format('llll')}</td>
                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>{user.group}</td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm rounded-pill'
                          onClick={() => editHandler(user)}
                          data-bs-toggle='modal'
                          data-bs-target='#editUserModal'
                        >
                          <FaPenAlt />
                        </button>

                        <button
                          className='btn btn-danger btn-sm ms-1 rounded-pill'
                          onClick={() => deleteHandler(user._id)}
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
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Users)), { ssr: false })

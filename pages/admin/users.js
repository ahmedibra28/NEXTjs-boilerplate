import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Pagination from '../../components/Pagination'
import { getUsers, updateUser, deleteUser, createUser } from '../../api/users'
import { getGroups } from '../../api/groups'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'

const Users = () => {
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

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'users',
    () => getUsers(page),
    {
      retry: 0,
    }
  )

  const { data: groupData } = useQuery('groups', () => getGroups())

  const {
    isLoading: isLoadingUpdateUser,
    isError: isErrorUpdateUser,
    error: errorUpdateUser,
    isSuccess: isSuccessUpdateUser,
    mutateAsync: updateUserMutateAsync,
  } = useMutation(['updateUser'], updateUser, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['users'])
    },
  })

  const {
    isLoading: isLoadingDeleteUser,
    isError: isErrorDeleteUser,
    error: errorDeleteUser,
    isSuccess: isSuccessDeleteUser,
    mutateAsync: deleteUserMutateAsync,
  } = useMutation(['deleteUser'], deleteUser, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  })

  const {
    isLoading: isLoadingCreateUser,
    isError: isErrorCreateUser,
    error: errorCreateUser,
    isSuccess: isSuccessCreateUser,
    mutateAsync: createUserMutateAsync,
  } = useMutation(['createUser'], createUser, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['users'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteUserMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateUserMutateAsync({
          _id: id,
          name: data.name,
          email: data.email,
          password: data.password,
          group: data.group,
        })
      : createUserMutateAsync(data)
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
    <div className='container'>
      {isSuccessDeleteUser && (
        <Message variant='success'>User has been deleted successfully.</Message>
      )}
      {isErrorDeleteUser && (
        <Message variant='danger'>{errorDeleteUser}</Message>
      )}
      {isSuccessUpdateUser && (
        <Message variant='success'>User has been updated successfully.</Message>
      )}
      {isErrorUpdateUser && (
        <Message variant='danger'>{errorUpdateUser}</Message>
      )}
      {isSuccessCreateUser && (
        <Message variant='success'>User has been Created successfully.</Message>
      )}
      {isErrorCreateUser && (
        <Message variant='danger'>{errorCreateUser}</Message>
      )}

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
                  <div className='mb-3'>
                    <label htmlFor='name'>Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.name && (
                      <span className='text-danger'>{errors.name.message}</span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='email'>Email Address</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.+\S+/,
                          message: 'Entered value does not match email format',
                        },
                      })}
                      type='email'
                      placeholder='Enter email'
                      className='form-control'
                    />
                    {errors.email && (
                      <span className='text-danger'>
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='password'>Password</label>
                    <input
                      {...register('password', {
                        minLength: {
                          value: 6,
                          message: 'Password must have at least 6 characters',
                        },
                      })}
                      type='password'
                      placeholder='Enter password'
                      className='form-control'
                    />
                    {errors.password && (
                      <span className='text-danger'>
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input
                      {...register('confirmPassword', {
                        minLength: {
                          value: 6,
                          message: 'Password must have at least 6 characters',
                        },
                        validate: (value) =>
                          value === watch().password ||
                          'The passwords do not match',
                      })}
                      type='password'
                      placeholder='Confirm password'
                      className='form-control'
                    />
                    {errors.confirmPassword && (
                      <span className='text-danger'>
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='group'>Group</label>
                    <select
                      {...register('group', { required: 'Group is required' })}
                      type='text'
                      placeholder='Enter group'
                      className='form-control'
                      autoFocus
                    >
                      <option value=''>-------</option>
                      {groupData &&
                        groupData.map((group) => (
                          <option key={group._id} value={group.name}>
                            {group.name}
                          </option>
                        ))}
                    </select>
                    {errors.group && (
                      <span className='text-danger'>
                        {errors.group.message}
                      </span>
                    )}
                  </div>

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
                      disabled={isLoadingCreateUser || isLoadingUpdateUser}
                    >
                      {isLoadingCreateUser || isLoadingUpdateUser ? (
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

      <div className='d-flex justify-content-between align-items-center'>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editUserModal'
        >
          <FaPlus className='mb-1' />
        </button>
        <h3 className=''>Users</h3>
        <Pagination data={data} setPage={setPage} />
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
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>GROUP</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>{user.group}</td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(user)}
                          data-bs-toggle='modal'
                          data-bs-target='#editUserModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(user._id)}
                          disabled={isLoadingDeleteUser}
                        >
                          {isLoadingDeleteUser ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              {' '}
                              <FaTrash className='mb-1' /> Delete
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
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Users)), { ssr: false })

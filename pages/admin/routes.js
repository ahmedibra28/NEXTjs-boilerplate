import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import { getRoutes, updateRoute, deleteRoute, addRoute } from '../../api/routes'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'

const Route = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'routes',
    () => getRoutes(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateRoute,
    isError: isErrorUpdateRoute,
    error: errorUpdateRoute,
    isSuccess: isSuccessUpdateRoute,
    mutateAsync: updateRouteMutateAsync,
  } = useMutation(['updateRoute'], updateRoute, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['routes'])
    },
  })

  const {
    isLoading: isLoadingDeleteRoute,
    isError: isErrorDeleteRoute,
    error: errorDeleteRoute,
    isSuccess: isSuccessDeleteRoute,
    mutateAsync: deleteRouteMutateAsync,
  } = useMutation(['deleteRoute'], deleteRoute, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['routes']),
  })

  const {
    isLoading: isLoadingAddRoute,
    isError: isErrorAddRoute,
    error: errorAddRoute,
    isSuccess: isSuccessAddRoute,
    mutateAsync: addRouteMutateAsync,
  } = useMutation(['addRoute'], addRoute, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['routes'])
    },
  })

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteRouteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateRouteMutateAsync({
          _id: id,
          path: data.path,
          component: data.component,
          isActive: data.isActive,
          name: data.name,
        })
      : addRouteMutateAsync(data)
  }

  const editHandler = (route) => {
    setId(route._id)
    setEdit(true)
    setValue('path', route.path)
    setValue('component', route.component)
    setValue('isActive', route.isActive)
    setValue('name', route.name)
  }

  return (
    <div className='container'>
      {isSuccessUpdateRoute && (
        <Message variant='success'>
          Route has been updated successfully.
        </Message>
      )}
      {isErrorUpdateRoute && (
        <Message variant='danger'>{errorUpdateRoute}</Message>
      )}
      {isSuccessAddRoute && (
        <Message variant='success'>
          Route has been Created successfully.
        </Message>
      )}
      {isErrorAddRoute && <Message variant='danger'>{errorAddRoute}</Message>}
      {isSuccessDeleteRoute && (
        <Message variant='success'>
          Route has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteRoute && (
        <Message variant='danger'>{errorDeleteRoute}</Message>
      )}
      <div
        className='modal fade'
        id='editRouteModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editRouteModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editRouteModalLabel'>
                {edit ? 'Edit Route' : 'Add Route'}
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
                    <label htmlFor='path'>Path</label>
                    <input
                      {...register('path', { required: 'Path is required' })}
                      type='text'
                      placeholder='Enter path'
                      className='form-control'
                      autoFocus
                    />
                    {errors.path && (
                      <span className='text-danger'>{errors.path.message}</span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='component'>Component</label>
                    <input
                      {...register('component', {
                        required: 'Component is required',
                      })}
                      type='text'
                      placeholder='Enter component'
                      className='form-control'
                      autoFocus
                    />
                    {errors.component && (
                      <span className='text-danger'>
                        {errors.component.message}
                      </span>
                    )}
                  </div>

                  <div className='row'>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='isActive'
                          {...register('isActive')}
                          checked={watch().isActive}
                        />
                        <label className='form-check-label' htmlFor='isActive'>
                          is Active?
                        </label>
                      </div>
                    </div>
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
                      disabled={isLoadingAddRoute || isLoadingUpdateRoute}
                    >
                      {isLoadingAddRoute || isLoadingUpdateRoute ? (
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
        <h3 className=''>Routes</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editRouteModal'
        >
          <FaPlus className='mb-1' />
        </button>
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
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>ROUTE NAME</th>
                  <th>PATH</th>
                  <th>COMPONENT</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((route) => (
                    <tr key={route._id}>
                      <td>{route.name}</td>
                      <td>{route.path}</td>
                      <td>{route.component}</td>
                      <td>
                        {route.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-route'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(route)}
                          data-bs-toggle='modal'
                          data-bs-target='#editRouteModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(route._id)}
                          disabled={isLoadingDeleteRoute}
                        >
                          {isLoadingDeleteRoute ? (
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

export default dynamic(() => Promise.resolve(withAuth(Route)), { ssr: false })

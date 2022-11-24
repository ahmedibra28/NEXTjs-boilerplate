import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../components'
import { DynamicFormProps, dynamicInputSelect } from '../../utils/dForms'
import FormView from '../../components/FormView'
import moment from 'moment'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import apiHook from '../../api'
import { IUserRole } from '../../models/UserRole'

const UserRoles = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getRolesApi = apiHook({
    key: ['roles'],
    method: 'GET',
    url: `auth/roles?page=${page}&q=${q}&limit=${25}`,
  })?.get
  const getUsersApi = apiHook({
    key: ['users'],
    method: 'GET',
    url: `auth/users?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const getApi = apiHook({
    key: ['user-roles'],
    method: 'GET',
    url: `auth/user-roles?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['user-roles'],
    method: 'POST',
    url: `auth/user-roles`,
  })?.post

  const updateApi = apiHook({
    key: ['user-roles'],
    method: 'PUT',
    url: `auth/user-roles`,
  })?.put

  const deleteApi = apiHook({
    key: ['user-roles'],
    method: 'DELETE',
    url: `auth/user-roles`,
  })?.deleteObj

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

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

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
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

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'User Roles List'
  const label = 'User Role'
  const modal = 'userRole'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const submitHandler = (data: Omit<IUserRole, '_id'>) => {
    edit
      ? updateApi?.mutateAsync({
          _id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={0} className="col-12">
      {dynamicInputSelect({
        register,
        errors,
        label: 'User',
        name: 'user',
        placeholder: 'User',
        value: 'name',
        data: getUsersApi?.data?.data.filter(
          (user: { confirmed: boolean; blocked: boolean }) =>
            user.confirmed && !user.blocked
        ),
      } as DynamicFormProps)}
    </div>,

    <div key={1} className="col-12">
      {dynamicInputSelect({
        register,
        errors,
        label: 'Role',
        name: 'role',
        placeholder: 'Role',
        data: getRolesApi?.data?.data,
        value: 'name',
      } as DynamicFormProps)}
    </div>,
  ]

  const modalSize = 'modal-lg'

  return (
    <>
      <Meta title="User Roles" />

      {deleteApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been deleted successfully.`}
        />
      )}
      {deleteApi?.isError && (
        <Message variant="danger" value={deleteApi?.error} />
      )}
      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been updated successfully.`}
        />
      )}
      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been Created successfully.`}
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
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
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>
            <button
              className="btn btn-outline-primary btn-sm shadow my-2"
              data-bs-toggle="modal"
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
            <div className="col-auto">
              <Search
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Role Type</th>
                <th>DateTime</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: Item) => (
                <tr key={item?._id}>
                  <td>{item?.user?.name}</td>
                  <td>{item?.user?.email}</td>
                  <td>{item?.role?.name}</td>
                  <td>{item?.role?.type}</td>

                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary btn-sm rounded-pill"
                        onClick={() => editHandler(item)}
                        data-bs-toggle="modal"
                        data-bs-target={`#${modal}`}
                      >
                        <FaPenAlt />
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-1 rounded-pill"
                        onClick={() => deleteHandler(item._id)}
                        disabled={deleteApi?.isLoading}
                      >
                        {deleteApi?.isLoading ? (
                          <span className="spinner-border spinner-border-sm" />
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

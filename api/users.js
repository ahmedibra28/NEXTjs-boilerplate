import axios from 'axios'
import { config } from '../utils/customLocalStorage'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import dynamicAPI from './dynamicAPI'

const url = '/api/admin/users'

export const getUserDetails = async (id) =>
  await dynamicAPI('get', `/api/users/${id}`, {})

export const login = async (credentials) => {
  try {
    const { data } = await axios.post(`/api/users/login`, credentials, config())

    const groupData = await axios.get(`/api/admin/groups`, config())

    const authRoutes =
      groupData &&
      groupData.data.filter((r) => r.name === data.group && r.route)[0]

    typeof window !== undefined &&
      localStorage.setItem('userGroup', JSON.stringify(authRoutes))

    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const logout = () => {
  typeof window !== undefined && localStorage.removeItem('userRoutes')
  typeof window !== undefined && localStorage.removeItem('userGroup')
  return typeof window !== undefined && localStorage.removeItem('userInfo')
}

export const registerUser = async (user) => {
  try {
    const { data } = await axios.post(`/api/users/register`, user, config())
    const groupData = await axios.get(`/api/admin/groups`, config())

    const authRoutes =
      groupData &&
      groupData.data.filter((r) => r.name === data.group && r.route)[0]

    typeof window !== undefined &&
      localStorage.setItem('userGroup', JSON.stringify(authRoutes))

    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateUserProfile = async (user) => {
  try {
    const { data } = await axios.put(`/api/users/profile`, user, config())
    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export default function useUsers(page) {
  const queryClient = useQueryClient()

  // get all users
  const getUsers = useQuery(
    'users',
    async () => await dynamicAPI('get', `${url}?page=${page}`, {}),
    { retry: 0 }
  )

  // get all users log
  const getUsersLog = useQuery(
    'usersLog',
    async () => await dynamicAPI('get', `${url}/logon?page=${page}`, {}),
    { retry: 0 }
  )

  // update group
  const updateUser = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['users']),
    }
  )

  // delete user
  const deleteUser = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['users']),
    }
  )

  // add user
  const addUser = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['users']),
    }
  )

  // forgot password
  const forgot = useMutation(
    async (obj) => await dynamicAPI('post', `/api/users/forgot`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['forgot']),
    }
  )

  // reset password
  const reset = useMutation(
    async (obj) =>
      await dynamicAPI('put', `/api/users/reset/${obj.resetToken}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['resetPassword']),
    }
  )

  return {
    getUsers,
    getUsersLog,
    updateUser,
    addUser,
    deleteUser,
    reset,
    forgot,
  }
}

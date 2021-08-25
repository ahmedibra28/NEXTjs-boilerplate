import axios from 'axios'
import { config } from '../utils/customLocalStorage'

import dynamicAPI from './dynamicAPI'

const url = '/api/admin/users'

export const getUsers = async (page) =>
  await dynamicAPI('get', `${url}?page=${page}`, {})

export const getUsersLog = async (page) =>
  await dynamicAPI('get', `${url}/logon?page=${page}`, {})

export const createUser = async (obj) => await dynamicAPI('post', url, obj)

export const updateUser = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteUser = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

export const getUserDetails = async (id) =>
  await dynamicAPI('get', `/api/users/${id}`, {})

export const forgot = async (obj) =>
  await dynamicAPI('post', `/api/users/forgot`, obj)

export const reset = async (obj) =>
  await dynamicAPI('put', `/api/users/reset/${obj.resetToken}`, obj)

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

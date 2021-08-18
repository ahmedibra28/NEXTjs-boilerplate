import axios from 'axios'
import { config } from '../utils/localStorageInfo'

export const getUsersLog = async (page) => {
  try {
    const { data } = await axios.get(
      `/api/admin/users/logs?page=${page}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const getUsers = async (page) => {
  try {
    const { data } = await axios.get(`/api/admin/users?page=${page}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const login = async (credentials) => {
  try {
    const { data } = await axios.post(`/api/users/login`, credentials, config())
    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const logout = () => {
  return typeof window !== undefined && localStorage.removeItem('userInfo')
}

export const registerUser = async (user) => {
  try {
    const { data } = await axios.post(`/api/users/register`, user, config())
    typeof window !== undefined &&
      localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateUser = async (user) => {
  try {
    const { data } = await axios.put(
      `/api/admin/users/${user._id}`,
      user,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteUser = async (id) => {
  try {
    const { data } = await axios.delete(`/api/admin/users/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const getUserDetails = async (id) => {
  try {
    const { data } = await axios.get(`/api/admin/users/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateUserProfile = async (user) => {
  try {
    const { data } = await axios.put(`/api/users/profile`, user, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const forgot = async (email) => {
  try {
    const { data } = await axios.post(`/api/users/forgot`, email, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const reset = async (info) => {
  try {
    const { data } = await axios.put(
      `/api/users/reset/${info.resetToken}`,
      info,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data
  }
}

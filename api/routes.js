import axios from 'axios'
import { config } from '../utils/localStorageInfo'

export const getRoutes = async () => {
  try {
    const { data } = await axios.get(`/api/admin/routes`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const addRoute = async (obj) => {
  try {
    const { data } = await axios.post(`/api/admin/routes`, obj, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateRoute = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/admin/routes/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteRoute = async (id) => {
  try {
    const { data } = await axios.delete(`/api/admin/routes/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

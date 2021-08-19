import axios from 'axios'
import { config } from '../utils/localStorageInfo'

export const getGroups = async () => {
  try {
    const { data } = await axios.get(`/api/admin/groups`, config())

    return data
  } catch (error) {
    throw error.response.data
  }
}

export const addGroup = async (obj) => {
  try {
    const { data } = await axios.post(`/api/admin/groups`, obj, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateGroup = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/admin/groups/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteGroup = async (id) => {
  try {
    const { data } = await axios.delete(`/api/admin/groups/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

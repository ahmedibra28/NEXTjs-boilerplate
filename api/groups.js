import axios from 'axios'
import { config } from '../utils/localStorageInfo'

export const getGroups = async () => {
  try {
    const { data } = await axios.get(`/api/groups`, config())

    return data
  } catch (error) {
    throw error.response.data
  }
}

export const addGroup = async (obj) => {
  try {
    const { data } = await axios.post(`/api/groups`, obj, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateGroup = async (obj) => {
  try {
    const { data } = await axios.put(`/api/groups/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteGroup = async (id) => {
  try {
    const { data } = await axios.delete(`/api/groups/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

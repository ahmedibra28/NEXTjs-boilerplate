import axios from 'axios'
import { config } from '../utils/localStorageInfo'

export const getRoutes = async () => {
  try {
    const { data } = await axios.get(`/api/routes`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const addRoute = async (obj) => {
  try {
    const { data } = await axios.post(`/api/routes`, obj, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const updateRoute = async (obj) => {
  try {
    const { data } = await axios.put(`/api/routes/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteRoute = async (id) => {
  try {
    const { data } = await axios.delete(`/api/routes/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data
  }
}

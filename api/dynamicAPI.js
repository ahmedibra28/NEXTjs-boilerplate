import axios from 'axios'
import { config } from '../utils/customLocalStorage'

const dynamicAPI = async (method, url, obj = {}) => {
  try {
    switch (method) {
      case 'get':
        return await axios.get(`${url}`, config()).then((res) => res.data)

      case 'post':
        return await axios.post(`${url}`, obj, config()).then((res) => res.data)

      case 'put':
        return await axios.put(url, obj, config()).then((res) => res.data)

      case 'delete':
        return await axios.delete(url, config()).then((res) => res.data)
    }
  } catch (error) {
    throw error.response.data
  }
}

export default dynamicAPI

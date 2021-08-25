import dynamicAPI from './dynamicAPI'

const url = '/api/admin/routes'

export const getRoutes = async () => await dynamicAPI('get', url, {})

export const addRoute = async (obj) => await dynamicAPI('post', url, obj)

export const updateRoute = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteRoute = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

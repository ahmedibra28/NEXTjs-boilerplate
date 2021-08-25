import dynamicAPI from './dynamicAPI'

const url = '/api/admin/groups'

export const getGroups = async () => await dynamicAPI('get', url, {})

export const addGroup = async (obj) => await dynamicAPI('post', url, obj)

export const updateGroup = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteGroup = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/admin/groups'

export default function useGroups() {
  const queryClient = useQueryClient()

  // get all groups
  const getGroups = useQuery(
    'groups',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0 }
  )

  // update group
  const updateGroup = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['groups']),
    }
  )

  // delete group
  const deleteGroup = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['groups']),
    }
  )

  // add group
  const addGroup = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['groups']),
    }
  )

  return { getGroups, updateGroup, deleteGroup, addGroup }
}

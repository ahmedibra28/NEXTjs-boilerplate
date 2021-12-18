import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/admin/routes'

export default function useRoutes() {
  const queryClient = useQueryClient()

  // get all routes
  const getRoutes = useQuery(
    'routes',
    async () => await dynamicAPI('get', url, {}),
    { retry: 0 }
  )

  // update route
  const updateRoute = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['routes']),
    }
  )

  // delete route
  const deleteRoute = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['routes']),
    }
  )

  // add route
  const addRoute = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['routes']),
    }
  )

  return { getRoutes, updateRoute, deleteRoute, addRoute }
}

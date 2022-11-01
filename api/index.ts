import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import axiosApi from './axiosApi'

export default function apiHook({ key, method, url }) {
  const queryClient = new QueryClient()
  switch (method) {
    case 'GET':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const get = useQuery(key, () => axiosApi(method, url, {}), {
        retry: 0,
      })
      return { get }

    case 'POST':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const post = useMutation((obj) => axiosApi(method, url, obj), {
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries(key),
      })
      return { post }

    case 'PUT':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const put = useMutation(
        (obj: { _id: string }) => axiosApi(method, `${url}/${obj?._id}`, obj),
        {
          retry: 0,

          onSuccess: () => queryClient.invalidateQueries(key),
        }
      )

      return { put }

    case 'DELETE':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const deleteObj = useMutation((id) => axiosApi(method, `${url}/${id}`), {
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries(key),
      })
      return { deleteObj }

    case 'UPLOAD':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const upload = useMutation(
        (obj: { _id: string }) => axiosApi('POST', url, obj),
        {
          retry: 0,

          onSuccess: () => queryClient.invalidateQueries(key),
        }
      )

      return { upload }

    default:
      break
  }
}

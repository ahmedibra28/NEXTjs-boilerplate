import {
  QueryClient,
  useMutation,
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query'
import api from './api'

interface Props {
  key: string[]
  method: string
  url: string
  scrollMethod?: string
}

export default function apiHook({ key, method, scrollMethod, url }: Props) {
  const queryClient = new QueryClient()
  switch (method) {
    case 'GET':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const get = useQuery(key, () => api(method, url, {}), {
        retry: 0,
      })

      return { get }

    case 'POST':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const post = useMutation((obj: any) => api(method, url, obj), {
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries(key),
      })
      return { post }

    case 'PUT':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const put = useMutation(
        (obj: any) => api(method, `${url}/${obj?._id}`, obj),
        {
          retry: 0,

          onSuccess: () => queryClient.invalidateQueries(key),
        }
      )

      return { put }

    case 'DELETE':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const deleteObj = useMutation(
        (id: string) => api(method, `${url}/${id}`),
        {
          retry: 0,
          onSuccess: () => queryClient.invalidateQueries(key),
        }
      )
      return { deleteObj }

    case 'InfiniteScroll':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const infinite = useInfiniteQuery(
        key,
        ({ pageParam = 1 }) =>
          api(scrollMethod, `${url}&page=${pageParam}`, {}),
        {
          getNextPageParam: (lastPage, allPages) => {
            const maxPage = lastPage?.pages
            const nextPage = allPages?.length + 1

            return nextPage <= maxPage ? nextPage : undefined
          },
          retry: 0,
        }
      )

      return { infinite }

    default:
      break
  }
}

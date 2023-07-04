import axios from 'axios'

let baseUrl = 'http://localhost:3000/api'

if (process.env.NODE_ENV === 'production') {
  baseUrl = getEnvVariable('DOMAIN_URL')
}

export const userInfo = () => {
  return {
    userInfo:
      typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(
            typeof window !== 'undefined' &&
              (localStorage.getItem('userInfo') as string | any)
          )
        : null,
  }
}

export const config = () => {
  return {
    headers: {
      Authorization: `Bearer ${userInfo().userInfo?.state?.userInfo?.token}`,
    },
  }
}

export const api = async (method: string, url: string, obj = {}) => {
  try {
    switch (method) {
      case 'GET':
        return await axios
          .get(`${baseUrl}/${url}`, config())
          .then((res) => res.data)

      case 'POST':
        return await axios
          .post(`${baseUrl}/${url}`, obj, config())
          .then((res) => res.data)

      case 'PUT':
        return await axios
          .put(`${baseUrl}/${url}`, obj, config())
          .then((res) => res.data)

      case 'DELETE':
        return await axios
          .delete(`${baseUrl}/${url}`, config())
          .then((res) => res.data)
    }
  } catch (error: any) {
    throw error?.response?.data?.error
  }
}

import {
  QueryClient,
  useMutation,
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { getEnvVariable } from '@/lib/helpers'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'InfiniteScroll'

interface ApiHookParams {
  key: string[]
  method: Method
  url: string
  scrollMethod?: 'GET'
}

// interface ApiHookResult {
//   post?: ReturnType<typeof useMutation>
//   get?: ReturnType<typeof useQuery>
//   update?: ReturnType<typeof useMutation>
//   deleteObj?: ReturnType<typeof useMutation>
//   infinite?: ReturnType<typeof useInfiniteQuery>
//   data?: T
// }

export default function useApi({
  key,
  method,
  scrollMethod,
  url,
}: ApiHookParams) {
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
        (obj: any) => api(method, `${url}/${obj?.id}`, obj),
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
      const infinite: any = useInfiniteQuery(
        key,
        ({ pageParam = 1 }) =>
          // @ts-ignore
          api(scrollMethod, `${url}&page=${pageParam}`),
        {
          getNextPageParam: (lastPage: any, allPages) => {
            const maxPage = lastPage?.pages
            const nextPage = allPages?.length + 1

            return nextPage <= maxPage ? nextPage : undefined
          },
          retry: 0,
        }
      )

      return { infinite, data: infinite.data }

    default:
      throw new Error(`Invalid method ${method}`)
  }
}

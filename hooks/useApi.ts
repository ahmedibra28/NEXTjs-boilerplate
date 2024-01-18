import axios from 'axios'
import {
  QueryClient,
  useMutation,
  useQuery,
  // useInfiniteQuery,
} from '@tanstack/react-query'

export let baseUrl = 'http://localhost:3000/api'

if (process.env.NODE_ENV === 'production') {
  baseUrl = process.env.NEXT_PUBLIC_API_URL as string
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
    const err = error?.response?.data?.error || 'Something went wrong'
    const expectedErrors = ['invalid signature', 'jwt expired']
    if (expectedErrors.includes(err)) {
      localStorage.removeItem('userInfo')
      window.location.reload()
    }
    throw err
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'InfiniteScroll'

interface ApiHookParams {
  key: string[]
  method: Method
  url: string
  scrollMethod?: 'GET'
}

export default function useApi({
  key,
  method,
  scrollMethod,
  url,
}: ApiHookParams) {
  const queryClient = new QueryClient()
  switch (method) {
    case 'GET':
      // eslint-disable-next-line
      const get = useQuery({
        queryKey: key,
        queryFn: () => api(method, url, {}),
        retry: 0,
      })

      return { get }

    case 'POST':
      // eslint-disable-next-line
      const post = useMutation({
        mutationFn: (obj: any) => api(method, url, obj),
        retry: 0,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: key })
        },
      })
      return { post }

    case 'PUT':
      // eslint-disable-next-line
      const put = useMutation({
        mutationFn: (obj: any) => api(method, `${url}/${obj?.id}`, obj),
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
      })

      return { put }

    case 'DELETE':
      // eslint-disable-next-line
      const deleteObj = useMutation({
        mutationFn: (id: string) => api(method, `${url}/${id}`),
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
      })
      return { deleteObj }

    // case 'InfiniteScroll':
    //   // eslint-disable-next-line
    //   const infinite = useInfiniteQuery({
    //     queryKey: key,
    //     queryFn: ({ pageParam = 1 }) =>
    //       api(scrollMethod, `${url}&page=${pageParam}`),
    //     getNextPageParam: (lastPage: any, allPages) => {
    //       const maxPage = lastPage?.pages
    //       const nextPage = allPages?.length + 1

    //       return nextPage <= maxPage ? nextPage : undefined
    //     },
    //     retry: 0,
    //   })

    //   return { infinite, data: infinite.data }

    default:
      throw new Error(`Invalid method ${method}`)
  }
}

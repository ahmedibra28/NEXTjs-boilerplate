import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/auth'

const queryKey = 'profiles'

export default function useProfilesHook(props) {
  const { page = 1, q = '', limit = 25 } = props

  const queryClient = useQueryClient()

  const getProfile = useQuery(
    queryKey,
    async () => await dynamicAPI('get', `${url}/profile`, {}),
    { retry: 0 }
  )

  const getUserProfiles = useQuery(
    'user profiles',
    async () =>
      await dynamicAPI(
        'get',
        `${url}/user-profiles?page=${page}&q=${q}&limit=${limit}`,
        {}
      ),
    { retry: 0 }
  )

  const postProfile = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/profile`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  return { getProfile, getUserProfiles, postProfile }
}

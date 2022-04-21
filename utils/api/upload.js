import dynamicAPI from './dynamicAPI'
import { useMutation } from 'react-query'

const url = '/api/upload'

export default function useUploadHook() {
  const postUpload = useMutation(
    async (obj) =>
      await dynamicAPI('post', `${url}?type=${obj.type}`, obj.formData),
    {
      retry: 0,
    }
  )

  return { postUpload }
}

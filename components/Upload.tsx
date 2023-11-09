'use client'

import useApi from '@/hooks/useApi'
import React from 'react'

export default function Upload({
  multiple = false,
  label,
  setFileLink,
  fileLink,
  fileType,
}: {
  multiple?: boolean
  label: string

  fileType: 'image' | 'document'
  setFileLink: (e: any) => void
  fileLink: string[]
}) {
  const [file, setFile] = React.useState<string[]>([])

  const uploadApi = useApi({
    key: ['upload'],
    method: 'POST',
    url: `uploads?type=${fileType}`,
  })?.post

  React.useEffect(() => {
    if (file?.length > 0) {
      const formData = new FormData()

      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i])
      }

      uploadApi
        ?.mutateAsync(formData)
        .then((res) => {
          const urls = res.data?.map((item: any) => item.url)

          if (multiple) {
            setFileLink([...fileLink, ...urls])
          } else {
            setFileLink(urls)
          }
        })
        .catch((err) => err)
    }
    // eslint-disable-next-line
  }, [file])

  return (
    <div className='form-control w-full'>
      {label && (
        <label className='label' htmlFor={label?.replace(/\s+/g, '-')}>
          {label}
        </label>
      )}
      <input
        disabled={Boolean(uploadApi?.isPending)}
        multiple={multiple}
        type='file'
        className='file-input file-input-ghost rounded-none border border-gray-300 w-full mb-1'
        id='formFile'
        onChange={(e: any) =>
          setFile(multiple ? e.target.files : [e.target.files[0]])
        }
      />
      {uploadApi?.isPending && (
        <div className='flex justify-start items-center'>
          <span className='loading loading-spinner loading-sm'> </span>
          <span className='ms-2 text-gray-500 text-sm'>
            {fileType} is uploading
          </span>
        </div>
      )}
      {uploadApi?.isError && (
        <span className='text-secondary text-sm mt-1'>
          {`${uploadApi?.error}` || `${fileType} upload failed`}
        </span>
      )}
      {uploadApi?.isSuccess && (
        <span className='text-success text-sm mt-1'>
          {uploadApi?.data?.message}
        </span>
      )}
    </div>
  )
}

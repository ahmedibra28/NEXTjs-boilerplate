'use client'

import useApi from '@/hooks/useApi'
import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

export interface FormInputProp {
  multiple?: boolean
  label?: string
  setFileLink: (e: any) => void
  fileLink: string[]
  fileType: 'image' | 'document'
  showLabel?: boolean
}

export default function Upload({
  multiple = false,
  label,
  setFileLink,
  fileLink,
  fileType,
  showLabel = true,
  ...props
}: FormInputProp) {
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
    <div className='w-full'>
      {label && showLabel && (
        <Label className='label' htmlFor={label?.replace(/\s+/g, '-')}>
          {label}
        </Label>
      )}

      <Input
        disabled={Boolean(uploadApi?.isPending)}
        multiple={multiple}
        type='file'
        id='formFile'
        onChange={(e: any) =>
          setFile(multiple ? e.target.files : [e.target.files[0]])
        }
        {...props}
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
        <span className='text-red-500 text-xs mt-1'>
          {`${uploadApi?.error}` || `${fileType} upload failed`}
        </span>
      )}
      {uploadApi?.isSuccess && (
        <span className='text-green-500 text-xs mt-1'>
          {uploadApi?.data?.message}
        </span>
      )}
    </div>
  )
}

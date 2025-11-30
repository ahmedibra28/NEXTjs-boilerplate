'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import ApiCall from '@/services/api'
import { FaSpinner, FaUpload, FaFileImage } from 'react-icons/fa'
import { XIcon } from 'lucide-react'

interface DragDropUploadProps {
  multiple?: boolean
  fileType: 'image' | 'document'
  onUploadSuccess: (urls: string[]) => void
  existingFiles?: string[]
  onFileDelete?: (url: string) => void
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  multiple = false,
  fileType,
  onUploadSuccess,
  existingFiles = [],
  onFileDelete,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  )
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(existingFiles)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const uploadApi = ApiCall({
    key: ['upload-drag-drop'],
    method: 'POST',
    url: `uploads?type=${fileType}`,
  })?.post

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
      e.dataTransfer.clearData()
    }
  }, [])

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files)

    // Filter files based on type
    const validFiles = fileArray.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (fileType === 'image') {
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(`.${ext}`)
      }
      if (fileType === 'document') {
        return ['.pdf', '.doc', '.docx', '.txt'].includes(`.${ext}`)
      }
      return true
    })

    if (validFiles.length === 0) {
      toast({
        title: 'Error!',
        description: 'No valid files selected',
        action: <ToastAction altText='Done'>Done</ToastAction>,
        variant: 'destructive',
      })
      return
    }

    if (!multiple && (validFiles.length > 1 || uploadedFiles.length > 0)) {
      toast({
        title: 'Error!',
        description: 'Only one file is allowed for this field',
        action: <ToastAction altText='Done'>Done</ToastAction>,
        variant: 'destructive',
      })
      return
    }

    uploadFiles(validFiles)
  }

  const uploadFiles = async (files: File[]) => {
    try {
      const formData = new FormData()

      files.forEach((file) => {
        formData.append('file', file)
      })

      // Simulate progress for better UX
      files.forEach((file) => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
      })

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev }
          let changed = false

          files.forEach((file) => {
            if (updated[file.name] < 90) {
              updated[file.name] = Math.min(updated[file.name] + 10, 90)
              changed = true
            }
          })

          if (!changed) {
            clearInterval(interval)
          }

          return updated
        })
      }, 200)

      const response = await uploadApi?.mutateAsync(formData)

      clearInterval(interval)

      // Set progress to 100%
      files.forEach((file) => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
      })

      const urls = response?.data?.map((item: any) => item.url) || []

      if (multiple) {
        const newFiles = [...uploadedFiles, ...urls]
        setUploadedFiles(newFiles)
        onUploadSuccess(newFiles)
      } else {
        setUploadedFiles(urls)
        onUploadSuccess(urls)
      }

      toast({
        title: 'Success!',
        description: `${files.length} file(s) uploaded successfully`,
        action: <ToastAction altText='Done'>Done</ToastAction>,
        variant: 'default',
      })

      // Clear progress after a delay
      setTimeout(() => {
        files.forEach((file) => {
          setUploadProgress((prev) => {
            const { [file.name]: _, ...rest } = prev
            return rest
          })
        })
      }, 2000)
    } catch (error: any) {
      files.forEach((file) => {
        setUploadProgress((prev) => {
          const { [file.name]: _, ...rest } = prev
          return rest
        })
      })

      toast({
        title: 'Error!',
        description: error?.message || 'File upload failed',
        action: <ToastAction altText='Done'>Done</ToastAction>,
        variant: 'destructive',
      })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = (url: string) => {
    const newFiles = uploadedFiles.filter((file) => file !== url)
    setUploadedFiles(newFiles)
    onUploadSuccess(newFiles)
    if (onFileDelete) {
      onFileDelete(url)
    }
  }

  return (
    <div className='w-full'>
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          multiple={multiple}
          onChange={handleFileInput}
          accept={fileType === 'image' ? 'image/*' : '*/*'}
        />

        <div className='flex flex-col items-center justify-center gap-2'>
          <FaUpload className='text-2xl text-gray-400 dark:text-gray-500' />
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <span className='font-medium text-blue-600 dark:text-blue-400'>
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-500'>
            {fileType === 'image'
              ? 'PNG, JPG, GIF up to 1MB'
              : 'PDF, DOC, DOCX, TXT up to 1MB'}
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className='mt-4 space-y-2'>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className='flex items-center gap-2'>
              <div className='flex-1'>
                <div className='flex justify-between text-xs mb-1'>
                  <span className='text-gray-600 dark:text-gray-400 truncate'>
                    {fileName}
                  </span>
                  <span className='text-gray-600 dark:text-gray-400'>
                    {progress}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
                  <div
                    className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              {progress === 100 && (
                <FaSpinner className='text-green-500 animate-spin' />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className='mt-4'>
          <div className='flex flex-wrap gap-2'>
            {uploadedFiles.map((url, index) => (
              <div key={index} className='relative group'>
                {fileType === 'image' ? (
                  <div className='relative'>
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className='object-cover w-16 h-16 rounded-md'
                    />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(url)
                      }}
                      className='absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <XIcon className='w-3 h-3' />
                    </button>
                  </div>
                ) : (
                  <div className='relative flex items-center p-2 bg-gray-100 rounded-md dark:bg-gray-800'>
                    <FaFileImage className='text-gray-500 dark:text-gray-400' />
                    <span className='ml-2 text-xs truncate max-w-[80px]'>
                      {url.split('/').pop()}
                    </span>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(url)
                      }}
                      className='absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <XIcon className='w-3 h-3' />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadApi?.isError && (
        <div className='mt-2 text-xs text-red-500'>
          {uploadApi?.error || 'File upload failed'}
        </div>
      )}
    </div>
  )
}

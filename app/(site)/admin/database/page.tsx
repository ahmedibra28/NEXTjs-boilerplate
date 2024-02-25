'use client'
import React, { useEffect } from 'react'
import useApi, { baseUrl } from '@/hooks/useApi'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Spinner from '@/components/Spinner'
import Message from '@/components/Message'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { FormButton } from '@/components/ui/CustomForm'
import { FaDatabase } from 'react-icons/fa6'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'

import JSZip from 'jszip'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'

function Page() {
  const path = useAuthorization()
  const router = useRouter()

  const {
    userInfo: { token },
  } = useUserInfoStore((state) => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const zip = new JSZip()

  const getApi = useApi({
    key: ['databases'],
    method: 'GET',
    url: `databases`,
  })?.get

  const postApi = useApi({
    key: ['databases'],
    method: 'POST',
    url: `databases/backup`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line
  }, [postApi?.isSuccess])

  const downloadDBHandler = async (db: string) => {
    return fetch(baseUrl + '/databases/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/zip',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ db }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        zip.file(db, blob)
        zip
          .generateAsync({
            type: 'blob',
            streamFiles: true,
          })
          .then((data) => {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = db
            link.click()
          })
      })
  }

  return (
    <div className='overflow-x-auto bg-white p-3 mt-2 container'>
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar
        isFetching={
          getApi?.isFetching || getApi?.isPending || postApi?.isPending
        }
      />

      <div className='text-center my-4'>
        <FormButton
          onClick={() => postApi?.mutateAsync({})}
          label='Backup Database'
          icon={<FaDatabase />}
        />
      </div>

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : getApi?.data?.data?.length > 0 ? (
        <Table>
          <TableCaption>A list of your recent databases.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Database</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getApi?.data?.data?.map((db: any) => (
              <TableRow key={db}>
                <TableCell>{db}</TableCell>
                <TableCell>
                  <FormButton
                    onClick={() => downloadDBHandler(db)}
                    label='Download'
                    icon={<FaDatabase />}
                    size='sm'
                    variant='secondary'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='text-center text-red-500 text-sm'>
          No databases found
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })

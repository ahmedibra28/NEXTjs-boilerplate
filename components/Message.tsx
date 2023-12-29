'use client'
import { useEffect, useState } from 'react'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

interface Props {
  value: string | any
}

import { toast } from 'sonner'

import { Toaster } from './ui/sonner'
import DateTime from '@/lib/dateTime'

const Message = ({ value = 'Internal Server Error!' }: Props) => {
  const [alert, setAlert] = useState(true)

  useEffect(() => {
    toast.message(value, {
      description: DateTime().format('ddd D MMM YYYY HH:mm:ss'),
      action: {
        label: 'Close',
        onClick: () => {},
      },
    })

    const timeId = setTimeout(() => {
      setAlert(false)
    }, 10000)

    return () => {
      clearTimeout(timeId)
    }
    // eslint-disable-next-line
  }, [alert])

  return (
    <>
      {alert && (
        <div>
          <Toaster position='top-right' className='bg-red-500' />
        </div>
      )}
    </>
  )
}

export default Message

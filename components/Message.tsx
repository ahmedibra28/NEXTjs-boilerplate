'use client'
import { useEffect, useState } from 'react'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

interface Props {
  variant: 'success' | 'error'
  value: string | any
}

const Message = ({ variant, value = 'Internal Server Error!' }: Props) => {
  const [alert, setAlert] = useState(true)

  useEffect(() => {
    const timeId = setTimeout(() => {
      setAlert(false)
    }, 10000)

    return () => {
      clearTimeout(timeId)
    }
  }, [alert])

  return (
    <>
      {alert && (
        <div className='toast z-50 fixed top-0 max-w-full'>
          <div
            className={`alert ${
              variant === 'success' ? 'alert-success' : 'alert-error'
            } flex flex-row justify-start items-center`}
          >
            <button
              className='border rounded-full p-1'
              onClick={() => setAlert(false)}
            >
              {variant === 'success' ? (
                <FaCircleCheck className='text-white' />
              ) : (
                <FaCircleXmark className='text-white' />
              )}
            </button>
            <span className='text-white whitespace-pre-line font-light'>
              {value}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Message

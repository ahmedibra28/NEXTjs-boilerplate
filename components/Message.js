import { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const Message = ({ variant, children }) => {
  const [alert, setAlert] = useState(true)

  useEffect(() => {
    const timeId = setTimeout(() => {
      setAlert(false)
    }, 5000)

    return () => {
      clearTimeout(timeId)
    }
  }, [alert])

  return (
    alert && (
      <div
        className='position-fixed top-0 end-0 p-2 animate__animated animate__lightSpeedInRight '
        style={{ zIndex: 900000 }}
      >
        <div
          className={`toast show text-${variant}`}
          role='alert'
          style={{ width: 'fit-content' }}
        >
          <div className='toast-body text-center '>
            {variant === 'success' ? (
              <FaCheckCircle className='fs-4 mr-3 mb-1' />
            ) : (
              <FaTimesCircle className='fs-4 mr-3 mb-1' />
            )}{' '}
            {children}
          </div>
        </div>
      </div>
    )
  )
}

export default Message

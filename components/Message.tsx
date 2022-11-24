import { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa'

interface Props {
  variant: string
  value: any
}

const Message = ({ variant, value }: Props) => {
  const [alert, setAlert] = useState(true)

  useEffect(() => {
    const timeId = setTimeout(() => {
      setAlert(false)
    }, 15000)

    return () => {
      clearTimeout(timeId)
    }
  }, [alert])

  return (
    <>
      {alert && (
        <div
          className="container d-flex justify-content-center position-fixed top-0 start-0 end-0 mt-3 text-center animate__animated animate__lightSpeedInRights animate__fadeInDown"
          style={{ zIndex: 900000, width: 'fit-content' }}
        >
          <div
            className={`toast show text-${variant} border border-${variant} bg-light rounded-0`}
            role="alert"
          >
            <div className="toast-body position-relative">
              {variant === 'success' ? (
                <FaCheckCircle className="fs-4 me-1 mb-1" />
              ) : (
                <FaTimesCircle className="fs-4 me-1 mb-1" />
              )}
              <br />
              <span>{value}</span>
              <div
                onClick={() => setAlert(false)}
                className="position-absolute bg-primary rounded-pill d-flex justify-content-center align-items-center"
                style={{ right: -10, top: -10, width: 30, height: 30 }}
              >
                <FaTimes className="text-light" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Message

'use client'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title?: string
  margin?: string
}

const FormContainer: React.FC<Props> = ({ children, title, margin = '' }) => {
  return (
    <div className={`max-w-6xl mx-auto ${margin}`}>
      <div className='flex flex-row justify-center items-center h-[85vh] max-auto'>
        <div className='w-full sm:w-[80%] md:w-[70%] lg:w-[45%] p-6 bg-white'>
          {title && (
            <div className='divider text-3xl uppercase mb-10'>{title}</div>
          )}
          {children}

          <div className='divider mt-10'>CONTACT</div>
          <div className='text-center'>
            <a
              className='text-gray-500 underline'
              href='mailto:info@ahmedibra.com'
            >
              info@ahmedibra.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormContainer

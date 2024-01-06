'use client'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title?: string
  margin?: string
}

const FormContainer: React.FC<Props> = ({ children, title, margin = '' }) => {
  return (
    <div className={`max-w-6xl mx-auto ${margin} w-full`}>
      <div className='flex flex-row justify-center items-center w-92 h-[85vh] max-auto'>
        <div className='w-full sm:w-[80%] md:w-[70%] lg:w-[45%] p-6 bg-white'>
          {title && (
            <div className='mb-10 space-y-3'>
              <div className='text-3xl uppercase text-center'>{title}</div>
            </div>
          )}
          {children}

          <div className='mt-10 space-y-3 text-center'>
            <hr />
            <div>CONTACT</div>
            <a
              className='text-gray-500 underline font-light'
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

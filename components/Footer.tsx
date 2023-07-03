'use client'

import moment from 'moment'

const Footer = () => {
  const year = moment().format('YYYY')
  return (
    <footer className='footer footer-center p-4 bg-white text-base-content max-h-6'>
      <div>
        <p className='text-gray-500'>
          Copyright © {year} - Developed by
          <a
            className='mx-1 font-bold'
            target='_blank'
            href='https://ahmedibra.com'
            rel='noreferrer'
          >
            Ahmed Ibrahim
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer

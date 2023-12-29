'use client'

import React from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { FaTrash } from 'react-icons/fa6'
import { Button } from './ui/button'

const Confirm = (action: () => void) => {
  return {
    customUI: ({ onClose }: { onClose: () => void }) => {
      return (
        <div className='p-5 shadow-2xl text-center text-dark w-auto md:w-96 min-w-6xl border border-gray-500 rounded-lg'>
          <h1 className='font-bold text-lg'>Are you sure?</h1>
          <p className='mb-5'>You want to delete this?</p>
          <div className='flex justify-around items-center mt-2'>
            <Button
              tabIndex={0}
              className='btn text-white bg-green-500'
              onClick={onClose}
            >
              No
            </Button>

            <Button
              tabIndex={0}
              className='btn text-white bg-red-500'
              onClick={() => {
                action()
                onClose()
              }}
            >
              <FaTrash className='mr-1' /> Yes, Delete it!
            </Button>
          </div>
        </div>
      )
    },
  }
}

export default Confirm

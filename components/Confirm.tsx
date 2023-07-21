'use client'

import React from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { FaTrash } from 'react-icons/fa6'

const Confirm = (action: () => void) => {
  return {
    customUI: ({ onClose }: { onClose: () => void }) => {
      return (
        <div className='p-5 shadow-2xl text-center text-dark w-auto md:w-96 min-w-6xl border border-primary rounded-lg'>
          <h1 className='font-bold text-lg'>Are you sure?</h1>
          <p className='mb-5'>You want to delete this?</p>
          <div className='btn-group flex justify-around mt-2'>
            <button className='btn text-white btn-success' onClick={onClose}>
              No
            </button>
            <button
              className='btn text-white btn-error'
              onClick={() => {
                action()
                onClose()
              }}
            >
              <FaTrash className='mb-1' /> Yes, Delete it!
            </button>
          </div>
        </div>
      )
    },
  }
}

export default Confirm

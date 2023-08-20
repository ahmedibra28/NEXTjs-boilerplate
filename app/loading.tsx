import React from 'react'

const Loading = () => {
  return (
    <div className='overflow-x-auto bg-white p-3 mt-16 '>
      <div className='flex items-center flex-col mb-2'>
        <h1 className='font-light text-2xl animate-pulse dark:bg-gray-700 w-full md:w-[40%] h-5'></h1>
        <h1 className='font-light text-2xl animate-pulse dark:bg-gray-700 w-28 h-10 mt-5'></h1>

        <h1 className='font-light text-2xl animate-pulse dark:bg-gray-700 w-64 h-12 mt-5'></h1>
        <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%] mx-auto'></div>
      </div>

      <div className='w-full h-72 mt-10'>
        <div className='h-4 animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-[100%] md:w-[70%]'></div>

        <div className='h-4 animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-[90%] md:w-[50%]'></div>

        <div className='h-4 animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-[70%] md:w-[90%]'></div>

        <div className='h-4 animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-[40%] md:w-[30%]'></div>

        <div className='h-4 animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-[30%] md:w-[50%]'></div>

        <div className='h-4 animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-[50%] md:w-[90%]'></div>
      </div>
    </div>
  )
}

export default Loading

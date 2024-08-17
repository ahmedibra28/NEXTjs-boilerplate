import React from 'react'

const Skeleton = () => {
  return (
    <div className='overflow-x-auto bg-white p-3 mt-2 mx-auto'>
      <div className='flex items-center flex-col mb-2'>
        <h1 className='font-light text-2xl animate-pulse dark:bg-gray-700 w-full md:w-[40%] h-5'></h1>
        <h1 className='font-light text-2xl animate-pulse dark:bg-gray-700 w-28 h-10 mt-5'></h1>

        <h1 className='font-light text-2xl animate-pulse dark:bg-gray-700 w-64 h-12 mt-5'></h1>
        <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%] mx-auto'></div>
      </div>

      <div className='w-full h-72 mt-10'>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className='flex justify-between items-center mt-2'>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8 hidden md:table-cell'></div>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8 hidden md:table-cell'></div>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8 hidden md:table-cell'></div>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8 hidden md:table-cell'></div>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8'></div>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8'></div>
            <div className='animate-pulse mb-3 bg-gray-300 dark:bg-gray-700 w-24 h-8'></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skeleton

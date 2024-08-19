import React from 'react'
import { Card } from '@/components/ui/card'

const Skeleton = () => {
  return (
    <Card className='overflow-x-auto p-4 mt-2 mx-auto'>
      <div className='flex flex-col mb-2 mt-4'>
        <h1 className='font-light text-2xl animate-pulse bg-gray-300 dark:bg-gray-700 w-full md:w-[10%] h-5 mr-auto'></h1>

        <div className='flex flex-row items-center justify-between mt-4'>
          <h1 className='font-light text-2xl animate-pulse bg-gray-300 dark:bg-gray-700 w-64 h-12 mt-5 mr-auto rounded'></h1>
          <div className='flex flex-row items-center justify-between gap-x-5'>
            <h1 className='font-light text-2xl animate-pulse bg-gray-300 dark:bg-gray-700 w-28 h-10 mt-5 rounded'></h1>
            <h1 className='font-light text-2xl animate-pulse bg-gray-300 dark:bg-gray-700 w-28 h-10 mt-5 rounded'></h1>
          </div>
        </div>
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
    </Card>
  )
}

export default Skeleton

'use client'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

interface Props {
  data: {
    startIndex: number
    endIndex: number
    total: number
    page: number
    pages: number
  }
  setPage: (page: number) => void
}

const Pagination = ({ data, setPage }: Props) => {
  return data ? (
    <div className='text-end my-1'>
      <span className='btn bg-white shadow'>
        {data.startIndex} - {data.endIndex} of {data.total}
      </span>
      <button
        disabled={data.page === 1}
        onClick={() => setPage(data.page - 1)}
        className='btn bg-white shadow mx-1'
      >
        <FaChevronLeft className='mb-1' />
      </button>
      <button
        disabled={data.page === data.pages}
        onClick={() => setPage(data.page + 1)}
        className='btn bg-white shadow'
      >
        <FaChevronRight className='mb-1' />
      </button>
    </div>
  ) : null
}

export default Pagination

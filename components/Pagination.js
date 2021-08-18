import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({ data, setPage }) => {
  return data ? (
    <div className='text-end my-1'>
      <span className='btn btn-light'>
        {data.startIndex} - {data.endIndex} of {data.total}
      </span>
      <span
        onClick={() => setPage(data.page - 1)}
        className={`btn btn-light mx-1 ${data.page === 1 && 'disabled'}`}
      >
        <FaChevronLeft className='mb-1' />
      </span>
      <span
        onClick={() => setPage(data.page + 1)}
        className={`btn btn-light ${data.page === data.pages && 'disabled'}`}
      >
        <FaChevronRight className='mb-1' />
      </span>
    </div>
  ) : null
}

export default Pagination

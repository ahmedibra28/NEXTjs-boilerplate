import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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
    <div className="text-end my-1">
      <span className="btn bg-light shadow">
        {data.startIndex} - {data.endIndex} of {data.total}
      </span>
      <span
        onClick={() => setPage(data.page - 1)}
        className={`btn bg-light shadow mx-1 ${data.page === 1 && 'disabled'}`}
      >
        <FaChevronLeft className="mb-1" />
      </span>
      <span
        onClick={() => setPage(data.page + 1)}
        className={`btn bg-light shadow ${
          data.page === data.pages && 'disabled'
        }`}
      >
        <FaChevronRight className="mb-1" />
      </span>
    </div>
  ) : null
}

export default Pagination

import { FormEvent } from 'react'
import { FaSearch } from 'react-icons/fa'

interface Props {
  q: string
  setQ: (value: string) => void
  placeholder: string
  searchHandler: (e: FormEvent) => void
}

const Search = ({ q, setQ, placeholder, searchHandler }: Props) => {
  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          aria-label="Search"
          onChange={(e) => setQ(e.target.value)}
          value={q}
        />
        <div className="input-group-append">
          <button type="submit" className="btn btn-outline-secondary">
            <FaSearch />
          </button>
        </div>
      </div>
    </form>
  )
}

export default Search

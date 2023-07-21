'use client'
import { FormEvent } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'

interface Props {
  q: string
  setQ: (value: string) => void
  placeholder: string
  searchHandler: (e: FormEvent) => void
}

const Search = ({ q, setQ, placeholder, searchHandler }: Props) => {
  return (
    <form onSubmit={searchHandler}>
      <div className='form-control'>
        <label className='input-group'>
          <input
            className='input rounded-none border border-gray-300 w-full focus:outline-none'
            type='text'
            placeholder={placeholder}
            aria-label='Search'
            onChange={(e) => setQ(e.target.value)}
            value={q}
          />
          {/* <span>BTC</span> */}
          <button type='submit' className='btn btn-outline-secondary'>
            <FaMagnifyingGlass />
          </button>
        </label>
      </div>
    </form>
  )
}

export default Search

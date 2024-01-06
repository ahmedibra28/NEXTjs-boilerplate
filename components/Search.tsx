'use client'
import { FormEvent } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'

interface Props {
  q: string
  setQ: (value: string) => void
  placeholder: string
  searchHandler: (e: FormEvent) => void
  type?: string
}

const Search = ({
  q,
  setQ,
  placeholder,
  searchHandler,
  type = 'text',
}: Props) => {
  return (
    <form onSubmit={searchHandler}>
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Input
          onChange={(e) => setQ(e.target.value)}
          value={q}
          type={type}
          placeholder={placeholder}
        />
        <Button type='submit'>
          <FaMagnifyingGlass />
        </Button>
      </div>
    </form>
  )
}

export default Search

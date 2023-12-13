'use client'

import { useEffect, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Search from './Search'
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowDownWideShort,
  FaArrowUpWideShort,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from 'react-icons/fa6'
import DropdownCheckbox from './DropdownCheckbox'

interface RTableProps {
  data: {
    data: any
    page?: number
    pages?: number
    total?: number
    startIndex?: number
    endIndex?: number
  }
  columns: any[]
  setPage?: (page: number) => void
  setLimit?: (limit: number) => void
  limit?: number
  q?: string
  setQ?: (q: string) => void
  searchHandler?: (e: any) => void
  modal?: string
}

const RTable: React.FC<RTableProps> = ({
  data,
  columns,
  setPage,
  setLimit,
  limit,
  q,
  setQ,
  searchHandler,
  modal,
}) => {
  const [sorting, setSorting] = useState<any[]>([])

  const [visibleColumns, setVisibleColumns] =
    useState<{ header: string; active: boolean }[]>(columns)

  useEffect(() => {
    if (!setPage || !data?.total || !data?.startIndex || !data?.endIndex) return
    if (
      Number(data?.total) < (Number(data?.startIndex) || Number(data?.endIndex))
    ) {
      setPage(1)
    }

    // eslint-disable-next-line
  }, [limit, data])

  const table = useReactTable({
    data: data?.data,
    columns: visibleColumns?.filter((item) => item.active),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: q,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQ,
  })

  useEffect(() => {
    if (limit) {
      table?.setPageSize(Number(limit))
    } else {
      table?.setPageSize(50)
    }

    // eslint-disable-next-line
  }, [limit])

  return (
    <>
      <div className='flex flex-col sm:flex-row justify-between items-center my-3 gap-2'>
        {setQ && searchHandler ? (
          <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%]'>
            <Search
              setQ={setQ}
              searchHandler={searchHandler}
              placeholder='Search'
              q={q!}
              type='text'
            />
          </div>
        ) : (
          <span />
        )}

        <div className='flex flex-row justify-start items-center'>
          {modal && (
            <button
              className='btn btn-primary rounded-none text-gray-100'
              // @ts-ignore
              onClick={() => window[modal].showModal()}
            >
              <FaPlus />
              {modal}
            </button>
          )}
          <DropdownCheckbox
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>
      </div>

      <table className='table table-xs md:table-sm'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className='flex flex-row justify-start items-center gap-1'>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'asc' ? (
                          <FaArrowUpWideShort />
                        ) : (
                          <FaArrowDownWideShort />
                        )
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table?.getRowModel()?.rows.length > 0 ? (
            table?.getRowModel()?.rows?.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={visibleColumns?.filter((item) => item.active)?.length}
                className='text-center h-24 text-red-400'
              >
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='flex flex-col sm:flex-row justify-between items-center my-3 gap-2'>
        {setLimit && limit && (
          <div>
            <span className='text-sm text-gray-700 font-sans'>
              Rows per page:{' '}
            </span>
            <select
              className='input rounded-none border border-gray-300 w-auto mt-5 input-sm'
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 20, 30, 50, 100, 200].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
        )}
        {setPage && data?.page && data?.pages ? (
          <div>
            <div className='join gap-x-1'>
              <button className='join-item btn' onClick={() => setPage(1)}>
                <FaAnglesLeft className='mb-1' />
              </button>
              <button
                className='join-item btn'
                disabled={data?.page === 1}
                onClick={() => setPage(Number(data?.page) - 1)}
              >
                <FaChevronLeft className='mb-1' />
              </button>
              <button className='join-item btn'>
                {data?.startIndex} - {data?.endIndex} of {data?.total}
              </button>
              <button
                className='join-item btn'
                disabled={data?.page === data?.pages}
                onClick={() => setPage(Number(data?.page) + 1)}
              >
                <FaChevronRight className='mb-1' />
              </button>
              <button
                className='join-item btn'
                onClick={() => setPage(Number(data?.pages))}
              >
                <FaAnglesRight className='mb-1' />
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default RTable

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
import { Button } from './ui/button'
import { FormatNumber } from './FormatNumber'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Capitalize } from '@/lib/capitalize'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDataStore from '@/zustand/dataStore'

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
  hasAdd?: boolean
  caption?: string
  searchType?: React.HTMLInputTypeAttribute
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
  hasAdd = true,
  caption,
  searchType = 'text',
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
      ...(searchType !== 'date' && { globalFilter: q }),
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

  const { setDialogOpen } = useDataStore((state) => state)

  return (
    <>
      <div className='my-3 flex flex-col items-center justify-between gap-2 sm:flex-row'>
        {setQ && searchHandler ? (
          <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%]'>
            <Search
              setQ={setQ}
              searchHandler={searchHandler}
              placeholder='Search'
              q={q!}
              type={searchType}
            />
          </div>
        ) : (
          <span />
        )}

        <div className='flex flex-row items-center justify-start gap-x-2'>
          {modal && hasAdd && (
            <Button onClick={() => setDialogOpen(true)}>
              <FaPlus /> {Capitalize(modal)}
            </Button>
          )}
          <DropdownCheckbox
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>
      </div>

      <Table className='text-xs md:text-sm'>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className='px-2 py-0'
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className='flex flex-row items-center justify-start gap-1'>
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
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table?.getRowModel()?.rows.length > 0 ? (
            table?.getRowModel()?.rows?.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className='px-2 py-0' key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <tr>
              <td
                colSpan={visibleColumns?.filter((item) => item.active)?.length}
                className='h-24 text-center text-red-400'
              >
                No Data Found
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      <div className='my-3 flex flex-col items-center justify-between gap-2 sm:flex-row'>
        {setLimit && limit && (
          <div className='flex items-center justify-start gap-x-1'>
            <span className='flex h-10 items-center justify-center rounded-md border px-2 font-sans text-sm text-gray-700'>
              Rows per page
            </span>
            <Select
              defaultValue={limit?.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className='w-auto focus:hidden'>
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50, 100, 200].map((limit) => (
                  <SelectItem key={limit} value={limit?.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {setPage && data?.page && data?.pages ? (
          <div className='flex gap-x-1'>
            <Button
              className='rounded-br-none rounded-tr-none'
              variant='outline'
              onClick={() => setPage(1)}
            >
              <FaAnglesLeft />
            </Button>
            <Button
              className='rounded-none'
              variant='outline'
              disabled={data?.page === 1}
              onClick={() => setPage(Number(data?.page) - 1)}
            >
              <FaChevronLeft />
            </Button>
            <Button className='rounded-none' variant='outline'>
              <FormatNumber value={data?.startIndex || 0} isCurrency={false} />
              <span className='mx-1'> - </span>{' '}
              <FormatNumber value={data?.endIndex || 0} isCurrency={false} />
              <span className='mx-1'> of </span>
              <FormatNumber value={data?.total || 0} isCurrency={false} />
            </Button>
            <Button
              className='rounded-none'
              variant='outline'
              disabled={data?.page === data?.pages}
              onClick={() => setPage(Number(data?.page) + 1)}
            >
              <FaChevronRight />
            </Button>
            <Button
              className='rounded-bl-none rounded-tl-none'
              variant='outline'
              onClick={() => setPage(Number(data?.pages))}
            >
              <FaAnglesRight />
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default RTable

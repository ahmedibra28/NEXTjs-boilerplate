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
import { DialogTrigger } from './ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'

interface RTableProps {
  children?: React.ReactNode
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
  caption?: string
}

const RTable: React.FC<RTableProps> = ({
  children,
  data,
  columns,
  setPage,
  setLimit,
  limit,
  q,
  setQ,
  searchHandler,
  modal,
  caption,
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

        <div className='flex flex-row justify-start items-center gap-x-2'>
          {children && modal && (
            <Dialog>
              <DialogTrigger>
                <div className='gap-x-1 rounded-md focus:hidden border border-input bg-background hover:bg-accent hover:text-accent-foreground flex justify-center items-center h-10 px-4 py-2 text-sm'>
                  <FaPlus />
                  {Capitalize(modal)}
                </div>
              </DialogTrigger>
              {children}
            </Dialog>
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
                  className='py-0 px-2'
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
                  <TableCell className='py-0 px-2' key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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
        </TableBody>
      </Table>

      <div className='flex flex-col sm:flex-row justify-between items-center my-3 gap-2'>
        {setLimit && limit && (
          <div className='flex justify-start items-center gap-x-1'>
            <span className='text-sm text-gray-700 font-sans border h-10 flex justify-center items-center rounded-md px-2'>
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
              className='rounded-tr-none rounded-br-none'
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
              className='rounded-tl-none rounded-bl-none'
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

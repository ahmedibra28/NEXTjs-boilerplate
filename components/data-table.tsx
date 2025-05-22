'use client'

import * as React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa6'
import useDataStore from '@/zustand/dataStore'
import { CloudUploadIcon, PlusIcon, SendIcon } from 'lucide-react'
import { FormatNumber } from '@/components/format-number'

export default function DataTable({
  columns,
  data,
  setPage,
  setLimit,
  limit,
  setQ,
  q,
  isPending,
  search,
  importExcelHandler,
  importExcelData,
  submitImportExcelHandler,
  hasAddButton = true,
}: {
  columns: ColumnDef<any>[]
  setQ?: (q: string) => void
  q?: string
  setPage?: (page: number) => void
  setLimit?: (limit: number) => void
  isPending?: boolean
  limit?: number
  search?: string
  data: {
    startIndex: number
    endIndex: number
    count: number
    page: number
    pages: number
    total: number
    data: any[]
  }
  importExcelHandler?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>
  importExcelData?: any[]
  submitImportExcelHandler?: (data: any) => void
  hasAddButton?: boolean
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const colVisibility = columns.reduce((acc: any, column: any) => {
    if (column.accessorKey) {
      acc[column.accessorKey] = !column.hiddenByDefault
    }
    return acc
  }) as any

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(colVisibility)
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data?.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    if (limit) {
      table?.setPageSize(Number(limit))
    } else {
      table?.setPageSize(50)
    }

    // eslint-disable-next-line
  }, [limit])

  const { setDialogOpen } = useDataStore((state) => state)

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-between py-4 gap-y-2 md:flex-row'>
        {setQ && (
          <Input
            placeholder='Filter...'
            value={
              q
                ? q
                : ((search &&
                    (table.getColumn(search)?.getFilterValue() as string)) ??
                  '')
            }
            onChange={(event) => {
              search &&
                table.getColumn(search)?.setFilterValue(event.target.value)
              setQ(event.target.value)
            }}
            className='max-w-sm'
          />
        )}
        <div className='flex items-center w-full gap-x-2 md:w-auto'>
          {importExcelHandler && (
            <>
              <label
                htmlFor='uploadFile'
                className='items-center hidden h-10 p-2 border rounded min-w-32 gap-x-2 border-input bg-background hover:bg-accent hover:text-accent-foreground md:flex'
              >
                <CloudUploadIcon className='size-5' />
                Upload
                <input
                  type='file'
                  accept='.xlsx,.xls'
                  onChange={importExcelHandler}
                  id='uploadFile'
                  className='hidden'
                />
              </label>
              {importExcelData && importExcelData?.length > 0 && (
                <Button variant='outline' onClick={submitImportExcelHandler}>
                  <SendIcon className='ml-2 size-5' />
                  Submit
                </Button>
              )}
            </>
          )}
          {hasAddButton && (
            <Button variant='outline' onClick={() => setDialogOpen(true)}>
              <PlusIcon /> Add New
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <FaChevronDown className='w-4 h-4 ml-2' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='relative overflow-x-auto border rounded-md'>
        <Table className='text-xs md:text-sm'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='py-0 text-xs md:text-sm'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {isPending ? 'Loading...' : 'No results'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex flex-col items-center justify-between gap-2 my-3 sm:flex-row'>
        {setLimit && limit && (
          <div className='flex items-center justify-start gap-x-1'>
            <span className='flex items-center justify-center h-10 px-2 font-sans text-sm text-gray-700 border rounded-md'>
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
    </div>
  )
}

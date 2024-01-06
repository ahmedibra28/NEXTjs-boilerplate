import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
  formChildren: React.ReactNode
}

export const useColumn = ({
  editHandler,
  isPending,
  deleteHandler,
  formChildren,
}: Column) => {
  const actionDropdown = (original: any) => (
    <ActionButton
      {...{
        editHandler,
        isPending,
        deleteHandler,
        original,
        formChildren,
      }}
    />
  )

  const columns = [
    { header: 'Name', accessorKey: 'name', active: true },
    {
      header: 'Method',
      accessorKey: 'method',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.method === 'GET' ? (
          <span className='text-green-500'>{original?.method}</span>
        ) : original?.method === 'POST' ? (
          <span className='text-blue-500'>{original?.method}</span>
        ) : original?.method === 'PUT' ? (
          <span className='text-yellow-500'>{original?.method}</span>
        ) : (
          <span className='text-red-500'>{original?.method}</span>
        ),
    },
    { header: 'Route', accessorKey: 'route', active: true },
    {
      header: 'CreatedAt',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: any) => actionDropdown(original),
    },
  ]

  return { columns }
}

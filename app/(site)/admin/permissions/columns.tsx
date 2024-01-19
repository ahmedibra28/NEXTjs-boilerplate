import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
}

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
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
      cell: ({ row: { original } }: any) => (
        <ActionButton
          editHandler={editHandler}
          isPending={isPending}
          deleteHandler={deleteHandler}
          original={original}
        />
      ),
    },
  ]
}

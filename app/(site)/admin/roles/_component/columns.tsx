import { actionButton } from '@/components/dForms'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
  modal?: string
}

export const columns = ({
  editHandler,
  isPending,
  deleteHandler,
  modal,
}: Column) => [
  { header: 'Name', accessorKey: 'name', active: true },
  {
    header: 'Type',
    accessorKey: 'type',
    active: true,
    cell: ({ row: { original } }: any) => original?.type?.toUpperCase(),
  },
  { header: 'Description', accessorKey: 'description', active: true },

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
    cell: ({ row: { original } }: any) =>
      actionButton({ editHandler, isPending, deleteHandler, modal, original }),
  },
]

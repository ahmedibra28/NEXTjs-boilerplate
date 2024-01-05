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
    { header: 'Menu', accessorKey: 'menu', active: true },
    { header: 'Sort', accessorKey: 'sort', active: true },
    { header: 'Path', accessorKey: 'path', active: true },
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
      cell: ({ row: { original } }: any) => actionDropdown(original),
    },
  ]

  return { columns }
}

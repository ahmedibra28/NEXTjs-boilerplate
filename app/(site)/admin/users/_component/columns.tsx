import { ButtonCircle } from '@/components/dForms'
import DateTime from '@/lib/dateTime'
import {
  FaCircleCheck,
  FaCircleXmark,
  FaEllipsis,
  FaFilePen,
  FaTrash,
} from 'react-icons/fa6'

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
  { header: 'Email', accessorKey: 'email', active: true },
  { header: 'Role', accessorKey: 'role.name', active: true },
  {
    header: 'Confirmed',
    accessorKey: 'confirmed',
    active: true,
    cell: ({ row: { original } }: any) =>
      original?.confirmed ? (
        <FaCircleCheck className='text-green-500' />
      ) : (
        <FaCircleXmark className='text-red-500' />
      ),
  },
  {
    header: 'Blocked',
    accessorKey: 'blocked',
    active: true,
    cell: ({ row: { original } }: any) =>
      !original?.blocked ? (
        <FaCircleCheck className='text-green-500' />
      ) : (
        <FaCircleXmark className='text-red-500' />
      ),
  },
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
      <div className='dropdown dropdown-top dropdown-left z-10'>
        <label tabIndex={0} className='cursor-pointer'>
          <FaEllipsis className='text-2xl' />
        </label>
        <ul
          tabIndex={0}
          className='dropdown-content menu p-2 bg-white rounded-tl-box rounded-tr-box rounded-bl-box w-28 border border-gray-200 shadow'
        >
          <li className='h-10 w-auto'>
            <ButtonCircle
              isLoading={false}
              label='Edit'
              onClick={() => {
                editHandler(original)
                // @ts-ignore
                window[modal].showModal()
              }}
              icon={<FaFilePen className='text-white' />}
              classStyle='btn-primary justify-start text-white'
            />
          </li>
          <li className='h-10 w-auto'>
            <ButtonCircle
              isLoading={isPending}
              label='Delete'
              onClick={() => deleteHandler(original.id)}
              icon={<FaTrash className='text-white' />}
              classStyle='btn-error justify-start text-white'
            />
          </li>
        </ul>
      </div>
    ),
  },
]

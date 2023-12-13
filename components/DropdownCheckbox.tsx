import React, { Fragment } from 'react'
import { FaFilter, FaSliders } from 'react-icons/fa6'

const DropdownCheckbox = ({
  visibleColumns,
  setVisibleColumns,
}: {
  visibleColumns: { header: string; active: boolean }[]
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<{ header: string; active: boolean }[]>
  >
}) => {
  const handleCheckboxChange = (index: number) => {
    const updatedColumns = [...visibleColumns]
    updatedColumns[index].active = !updatedColumns[index].active
    setVisibleColumns(updatedColumns)
  }

  return (
    <Fragment>
      <div className='dropdown dropdown-left z-10'>
        <label tabIndex={0} className='btn rounded-none m-1 text-gray-700'>
          <FaSliders /> View
        </label>
        <ul
          tabIndex={0}
          className='dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-48'
        >
          {visibleColumns?.map((item, i: number) => (
            <li key={i}>
              <div className='flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-300'>
                <input
                  id={`checkbox-item-${i}`}
                  type='checkbox'
                  checked={item.active}
                  onChange={() => handleCheckboxChange(i)}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                />
                <label
                  htmlFor={`checkbox-item-${i}`}
                  className='w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-500'
                >
                  {item.header}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  )
}
export default DropdownCheckbox

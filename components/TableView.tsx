import React from 'react'

const TableView = ({ table }: { table: any }) => {
  return (
    <table className='table table-xs md:table-sm'>
      <thead className='border-0'>
        <tr>
          {table?.header?.map((item: any, i: number) => (
            <th key={i} className={item?.className || ''}>
              {item?.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table?.data?.map((item: any, i: number) => (
          <tr key={i}>
            {table?.body?.map((body: any, j: number) => (
              <td key={j} className={body?.className || ''}>
                {body?.format(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableView

import moment from 'moment'
import Image from 'next/image'
import { FaCheckCircle, FaPenAlt, FaTimesCircle, FaTrash } from 'react-icons/fa'
import Search from './Search'

const TableView = (props) => {
  const table = props?.table
  const editHandler = props?.editHandler
  const deleteHandler = props?.deleteHandler
  const isLoadingDelete = props?.isLoadingDelete
  const setQ = props?.setQ
  const q = props?.q
  const searchHandler = props?.searchHandler
  const name = props?.name
  const label = props?.label
  const modal = props?.modal
  const searchPlaceholder = props?.searchPlaceholder
  const searchInput = props?.searchInput
  const addBtn = props?.addBtn

  function getDeepObjValue(item, s) {
    return s.split('.').reduce((p, c) => {
      p = p[c]
      return p
    }, item)
  }

  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          {name}
          <sup className='fs-6'> [{table.data && table.data.total}] </sup>
        </h3>
        {addBtn && (
          <button
            className='btn btn-outline-primary btn-sm shadow my-2'
            data-bs-toggle='modal'
            data-bs-target={`#${modal}`}
          >
            Add New {label}
          </button>
        )}
        {searchInput && (
          <div className='col-auto'>
            <Search
              placeholder={searchPlaceholder}
              setQ={setQ}
              q={q}
              searchHandler={searchHandler}
            />
          </div>
        )}
      </div>
      <table className='table table-sm table-border'>
        <thead className='border-0'>
          <tr>
            {table.image && <th>Image</th>}
            {table.header.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
            {table.createdAt && <th>CreatedAt</th>}
            {table.confirmed && <th>Confirmed</th>}
            {table.blocked && <th>Blocked</th>}
            {table.auth && <th>Auth</th>}

            {(editHandler || deleteHandler) && (
              <th className='text-right'>Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {table?.data?.data.map((item) => {
            return (
              <tr key={item._id}>
                {table.image && (
                  <td>
                    <Image
                      width='30'
                      height='30'
                      src={item.image}
                      alt={item.name}
                      className='img-fluid rounded-pill'
                    />
                  </td>
                )}
                {table?.body.map((keys, i) => {
                  return <td key={i}>{getDeepObjValue(item, keys)}</td>
                })}

                {table.createdAt && (
                  <td>{moment(item.createdAt).format('lll')}</td>
                )}

                {table.confirmed && (
                  <td>
                    {item.confirmed ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}
                  </td>
                )}

                {table.blocked && (
                  <td>
                    {item.blocked ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}
                  </td>
                )}

                {table.auth && (
                  <td>
                    {item.auth ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}
                  </td>
                )}

                {(editHandler || deleteHandler) && (
                  <td>
                    <div className='btn-group'>
                      {editHandler && (
                        <button
                          className='btn btn-primary btn-sm rounded-pill'
                          onClick={() => editHandler(item)}
                          data-bs-toggle='modal'
                          data-bs-target={`#${modal}`}
                        >
                          <FaPenAlt />
                        </button>
                      )}

                      {deleteHandler && (
                        <button
                          className='btn btn-danger btn-sm ms-1 rounded-pill'
                          onClick={() => deleteHandler(item._id)}
                          disabled={isLoadingDelete}
                        >
                          {isLoadingDelete ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              <FaTrash />
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TableView

import { FaPenAlt, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const TableView = (props) => {
  const data = props?.data
  const editHandler = props?.editHandler
  const deleteHandler = props?.deleteHandler
  const isLoadingDelete = props?.isLoadingDelete
  const setQ = props?.setQ
  const q = props?.q
  const searchHandler = props?.searchHandler
  const Search = props?.Search
  const name = props?.name
  const label = props?.label
  const header = props?.header
  const body = props?.body
  const modal = props?.modal
  const searchPlaceholder = props?.searchPlaceholder

  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          {name} <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>
        <button
          className='btn btn-outline-primary btn-sm shadow my-2'
          data-bs-toggle='modal'
          data-bs-target={modal}
        >
          Add New {label}
        </button>
        {Search && setQ && q && searchHandler && searchPlaceholder && (
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
            {header.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
            {(editHandler || deleteHandler) && (
              <th className='text-right'>Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((item) => (
              <tr key={item._id}>
                {body.map((i, index) => (
                  <td key={index}>{item[i]}</td>
                ))}

                {(editHandler || deleteHandler) && (
                  <td>
                    <div className='btn-group'>
                      {editHandler && (
                        <button
                          className='btn btn-primary btn-sm rounded-pill'
                          onClick={() => editHandler(item)}
                          data-bs-toggle='modal'
                          data-bs-target={modal}
                        >
                          <FaPenAlt />
                        </button>
                      )}

                      {deleteHandler && (
                        <button
                          className='btn btn-danger btn-sm ms-1 rounded-pill'
                          onClick={() => deleteHandler(item)}
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
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableView

import { FaPenAlt, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Search } from '..'

const ViewPermissions = ({
  data,
  editHandler,
  deleteHandler,
  isLoadingDelete,
  setQ,
  q,
  searchHandler,
}) => {
  const method = (color, method, permission) => {
    return (
      permission.method === method && (
        <span className={`badge bg-${color} px-2`}>{permission.method}</span>
      )
    )
  }
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          Permissions List <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>
        <button
          className='btn btn-outline-primary btn-sm shadow my-2'
          data-bs-toggle='modal'
          data-bs-target='#permissionModal'
        >
          Add New Permission
        </button>
        <div className='col-auto'>
          <Search
            placeholder='Search by name'
            setQ={setQ}
            q={q}
            searchHandler={searchHandler}
          />
        </div>
      </div>
      <table className='table table-sm table-border'>
        <thead className='border-0'>
          <tr>
            <th>Name</th>
            <th>Method</th>
            <th>Route</th>
            <th>Auth</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((permission) => (
              <tr key={permission._id}>
                <td>{permission.name}</td>
                <td>
                  {method('primary', 'GET', permission)}
                  {method('success', 'POST', permission)}
                  {method('warning', 'PUT', permission)}
                  {method('danger', 'DELETE', permission)}
                </td>
                <td>{permission.route}</td>
                <td>
                  {permission.auth ? (
                    <FaCheckCircle className='text-success' />
                  ) : (
                    <FaTimesCircle className='text-danger' />
                  )}
                </td>

                <td>
                  <div className='btn-group'>
                    <button
                      className='btn btn-primary btn-sm rounded-pill'
                      onClick={() => editHandler(permission)}
                      data-bs-toggle='modal'
                      data-bs-target='#permissionModal'
                    >
                      <FaPenAlt />
                    </button>

                    <button
                      className='btn btn-danger btn-sm ms-1 rounded-pill'
                      onClick={() => deleteHandler(permission._id)}
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
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewPermissions

import { FaPenAlt, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Search } from '..'

const ViewClientPermissions = ({
  data,
  editHandler,
  deleteHandler,
  isLoadingDelete,
  setQ,
  q,
  searchHandler,
}) => {
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          Client Permissions List{' '}
          <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>
        <button
          className='btn btn-outline-primary btn-sm shadow my-2'
          data-bs-toggle='modal'
          data-bs-target='#clientPermissionModal'
        >
          Add New Client Permission
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
            <th>Menu</th>
            <th>Path</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((clientPermission) => (
              <tr key={clientPermission._id}>
                <td>{clientPermission.name}</td>
                <td>{clientPermission.menu}</td>
                <td>{clientPermission.path}</td>
                <td>{clientPermission.description}</td>
                <td>
                  <div className='btn-group'>
                    <button
                      className='btn btn-primary btn-sm rounded-pill'
                      onClick={() => editHandler(clientPermission)}
                      data-bs-toggle='modal'
                      data-bs-target='#clientPermissionModal'
                    >
                      <FaPenAlt />
                    </button>

                    <button
                      className='btn btn-danger btn-sm ms-1 rounded-pill'
                      onClick={() => deleteHandler(clientPermission._id)}
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

export default ViewClientPermissions

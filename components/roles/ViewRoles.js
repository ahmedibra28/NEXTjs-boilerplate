import { FaPenAlt, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Search } from '..'

const ViewRoles = ({
  data,
  editHandler,
  deleteHandler,
  isLoadingDelete,
  setQ,
  q,
  searchHandler,
}) => {
  const method = (color, method, role) => {
    return (
      role.method === method && (
        <span className={`badge bg-${color} px-2`}>{role.method}</span>
      )
    )
  }
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          Roles List <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>
        <button
          className='btn btn-outline-primary btn-sm shadow my-2'
          data-bs-toggle='modal'
          data-bs-target='#roleModal'
        >
          Add New Role
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
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((role) => (
              <tr key={role._id}>
                <td>{role.name}</td>
                <td>{role.type}</td>
                <td>{role.description}</td>

                <td>
                  <div className='btn-group'>
                    <button
                      className='btn btn-primary btn-sm rounded-pill'
                      onClick={() => editHandler(role)}
                      data-bs-toggle='modal'
                      data-bs-target='#roleModal'
                    >
                      <FaPenAlt />
                    </button>

                    <button
                      className='btn btn-danger btn-sm ms-1 rounded-pill'
                      onClick={() => deleteHandler(role._id)}
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

export default ViewRoles

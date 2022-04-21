import { FaPenAlt, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Search } from '..'

const ViewUserRoles = ({
  data,
  editHandler,
  deleteHandler,
  isLoadingDelete,
  setQ,
  q,
  searchHandler,
}) => {
  const method = (color, method, userRole) => {
    return (
      userRole.method === method && (
        <span className={`badge bg-${color} px-2`}>{userRole.method}</span>
      )
    )
  }
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          UserRoles List <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>
        <button
          className='btn btn-outline-primary btn-sm shadow my-2'
          data-bs-toggle='modal'
          data-bs-target='#userRoleModal'
        >
          Add New UserRole
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
            <th>Email</th>
            <th>Role</th>
            <th>Role Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((userRole) => (
              <tr key={userRole._id}>
                <td>{userRole.user && userRole.user.name}</td>
                <td>{userRole.user && userRole.user.email}</td>
                <td>{userRole.role && userRole.role.name}</td>
                <td>{userRole.role && userRole.role.type}</td>

                <td>
                  <div className='btn-group'>
                    <button
                      className='btn btn-primary btn-sm rounded-pill'
                      onClick={() => editHandler(userRole)}
                      data-bs-toggle='modal'
                      data-bs-target='#userRoleModal'
                    >
                      <FaPenAlt />
                    </button>

                    <button
                      className='btn btn-danger btn-sm ms-1 rounded-pill'
                      onClick={() => deleteHandler(userRole._id)}
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

export default ViewUserRoles

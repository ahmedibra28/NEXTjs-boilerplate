import { Search } from '..'
import Image from 'next/image'

const ViewUserProfiles = ({ data, setQ, q, searchHandler }) => {
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          UserProfiles List <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>

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
            <th>Image</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((userProfile) => (
              <tr key={userProfile._id}>
                <td>
                  <Image
                    width='30'
                    height='30'
                    src={userProfile.image}
                    alt={userProfile.name}
                    className='img-fluid rounded-pill'
                  />
                </td>
                <td>{userProfile.name}</td>
                <td>{userProfile.address}</td>
                <td>{userProfile.phone}</td>
                <td>{userProfile.user && userProfile.user.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewUserProfiles

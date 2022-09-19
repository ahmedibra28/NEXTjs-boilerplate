import dynamic from 'next/dynamic'
import Link from 'next/link'
import withAuth from '../HOC/withAuth'

const Home: React.FC = () => {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-6 mx-auto'>
          <h6 className='fw-bold text-uppercase mb-3'>
            Restricted Available Routes
          </h6>
          <ol>
            <li className='fw-bold'>Admin</li>
            <ul>
              <li>
                <Link href='/admin/auth/users'>
                  <a className='text-decoration-none text-muted'>Users</a>
                </Link>
              </li>
              <li>
                <Link href='/admin/auth/permissions'>
                  <a className='text-decoration-none text-muted'>Permissions</a>
                </Link>
              </li>
              <li>
                <Link href='/admin/auth/client-permissions'>
                  <a className='text-decoration-none text-muted'>
                    Client permissions
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/admin/auth/user-roles'>
                  <a className='text-decoration-none text-muted'>User roles</a>
                </Link>
              </li>
              <li>
                <Link href='/admin/auth/user-profiles'>
                  <a className='text-decoration-none text-muted'>
                    User profiles
                  </a>
                </Link>
              </li>
            </ul>
            <li className='fw-bold'>Username</li>
            <ul>
              <li>
                <Link href='/account/profile'>
                  <a className='text-decoration-none text-muted'>Profiles</a>
                </Link>
              </li>
            </ul>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })

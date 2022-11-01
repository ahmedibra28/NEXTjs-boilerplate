import React from 'react'
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
                <Link
                  className='text-decoration-none text-muted'
                  href='/admin/auth/users'
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  className='text-decoration-none text-muted'
                  href='/admin/auth/roles'
                >
                  Roles
                </Link>
              </li>
              <li>
                <Link
                  className='text-decoration-none text-muted'
                  href='/admin/auth/permissions'
                >
                  Permissions
                </Link>
              </li>
              <li>
                <Link
                  className='text-decoration-none text-muted'
                  href='/admin/auth/client-permissions'
                >
                  Client permissions
                </Link>
              </li>
              <li>
                <Link
                  className='text-decoration-none text-muted'
                  href='/admin/auth/user-roles'
                >
                  User roles
                </Link>
              </li>
              <li>
                <Link
                  className='text-decoration-none text-muted'
                  href='/admin/auth/user-profiles'
                >
                  User profiles
                </Link>
              </li>
            </ul>
            <li className='fw-bold'>Username</li>
            <ul>
              <li>
                <Link
                  className='text-decoration-none text-muted'
                  href='/account/profile'
                >
                  Profiles
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

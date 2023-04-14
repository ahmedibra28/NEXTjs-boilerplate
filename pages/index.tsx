import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import withAuth from '../HOC/withAuth'

const Home = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-6 mx-auto">
          <h6 className="fw-bold text-uppercase mb-3">
            Restricted Available Routes
          </h6>
          <ol>
            <li className="fw-bold">Admin</li>
            <ul>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/admin/users"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/admin/roles"
                >
                  Roles
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/admin/permissions"
                >
                  Permissions
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/admin/client-permissions"
                >
                  Client permissions
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/admin/user-roles"
                >
                  User roles
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/admin/user-profiles"
                >
                  User profiles
                </Link>
              </li>
            </ul>
            <li className="fw-bold">Username</li>
            <ul>
              <li>
                <Link
                  className="text-decoration-none text-muted"
                  href="/account/profile"
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

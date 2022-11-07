import React from 'react'
import Link from 'next/link'

const SideBar = () => {
  const items = [
    {
      _id: '1',
      name: 'Admin',
      subItems: [
        {
          _id: '1',
          name: 'Users',
        },
        {
          _id: '2',
          name: 'Roles',
        },
        {
          _id: '3',
          name: 'Permissions',
        },
        {
          _id: '4',
          name: 'Client Permissions',
        },
        {
          _id: '5',
          name: 'User Roles',
        },
        {
          _id: '6',
          name: 'User Profiles',
        },
      ],
    },
    {
      _id: '2',
      name: 'Ahmed Ibrahim',
      subItems: [
        {
          _id: '1',
          name: 'Profile',
        },
      ],
    },
  ]
  return (
    <div
      className="bg-light"
      style={{ minWidth: 250, minHeight: 'calc(100vh - 120px)' }}
    >
      <div className="container pt-2">
        <ul className="navbar-nav">
          <div>
            {items?.map((item) => (
              <>
                <div key={item?._id} className="mb-3">
                  <label htmlFor="label" className="">
                    {item?.name}
                  </label>
                  {item?.subItems?.map((sub) => (
                    <div key={sub?._id} className="ms-2s">
                      <Link
                        className="nav-link active py-1 text-muted"
                        aria-current="page"
                        href="#"
                      >
                        {sub?.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        </ul>
      </div>
    </div>
  )
}

export default SideBar

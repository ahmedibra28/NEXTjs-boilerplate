'use client'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { Fragment } from 'react'
import {
  FaAngleDown,
  FaAngleUp,
  FaGears,
  FaLink,
  FaUserShield,
} from 'react-icons/fa6'

const Sidebar = ({ children }: any) => {
  const { userInfo } = useUserInfoStore((state) => state)

  const [menu, setMenu] = React.useState<any>(userInfo.menu)

  React.useEffect(() => {
    if (userInfo.id) {
      setMenu(userInfo.menu)
    }
  }, [userInfo])

  const handleToggle = (item: any) => {
    const newMenu = menu.map((x: any) => {
      if (x.name === item.name) {
        return { ...x, open: !x.open }
      }
      return { ...x, open: false }
    })
    setMenu(newMenu)
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const pickIcon = (name: string) => {
    switch (name) {
      case 'admin':
        return <FaUserShield className='w-5 h-auto mb-1 mr-2' />
      case 'setting':
        return <FaGears className='w-5 h-auto mb-1 mr-2' />
      default:
        return <FaLink className='w-5 h-auto mb-1 mr-2' />
    }
  }

  return (
    <div className='drawer lg:drawer-open'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content m-4'>{children}</div>
      <div className='drawer-side lg:h-[91vh]'>
        <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
        {userInfo.id && (
          <ul className='menu p-4 w-64 h-full text-base-content lg:bg-transparent bg-white'>
            {menu.map((item: any, i: number) => (
              <Fragment key={i}>
                {!item?.children && (
                  <li>
                    <Link href={item.path}>
                      <FaLink className='w-5 h-auto mb-1' />
                      {item.name}
                    </Link>
                  </li>
                )}

                {item?.children && (
                  <li key={item.name}>
                    <span
                      onClick={() => handleToggle(item)}
                      className='flex justify-between items-center'
                    >
                      <span className='flex justify-start items-center'>
                        {pickIcon(item.name)}
                        {capitalizeFirstLetter(item.name)}
                      </span>
                      {!item.open ? (
                        <FaAngleDown className='text-gray-700 text-lg' />
                      ) : (
                        <FaAngleUp className='text-gray-700 text-lg' />
                      )}
                    </span>
                    <div className='dropdown dropdown-end hover:bg-transparent py-0'>
                      {item.open && (
                        <ul className='p-2 bg-ghost border-0'>
                          {item.children.map((child: any, i: number) => (
                            <li key={i}>
                              <Link href={child.path}>{child.name}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Sidebar), { ssr: false })

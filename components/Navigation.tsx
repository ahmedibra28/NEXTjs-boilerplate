'use client'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { FaAngleDown, FaAngleUp, FaBars, FaPowerOff } from 'react-icons/fa6'

const Navigation = () => {
  const { userInfo } = useUserInfoStore((state) => state)
  const [menu, setMenu] = React.useState<any>(userInfo.menu)

  const handleLogout = () => {
    useUserInfoStore.getState().logout()
  }

  React.useEffect(() => {
    const label = document.querySelector(`[data-drawer-target="bars"]`)
    if (userInfo.id) {
      setMenu(userInfo.menu)
      label?.classList.remove('hidden')
    } else {
      label?.classList.add('hidden')
    }
  }, [userInfo])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  React.useEffect(() => {
    const handleClickOutside = () => {
      const details = document.getElementsByTagName('details')
      for (let i = 0; i < details.length; i++) {
        details[i].removeAttribute('open')
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleToggle = (item: any) => {
    const newMenu = menu.map((x: any) => {
      if (x.name === item.name) {
        return { ...x, open: !x.open }
      }
      return { ...x, open: false }
    })
    setMenu(newMenu)
  }

  const auth = (
    <>
      <div className='flex-none hidden lg:block'>
        <ul className='menu menu-horizontal px-1'>
          {menu.map((item: any, i: number) => (
            <Fragment key={i}>
              {!item?.children && (
                <li>
                  <Link href={item.path}>{item.name}</Link>
                </li>
              )}

              {item?.children && (
                <li key={item.name}>
                  <details>
                    <summary> {capitalizeFirstLetter(item.name)}</summary>

                    <ul className='p-2 bg-base-100 rounded z-20 w-44 top-10 right-0'>
                      {item.children.map((child: any, i: number) => (
                        <li key={i}>
                          <Link href={child.path}>{child.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>

      <div
        suppressHydrationWarning={true}
        className='dropdown dropdown-end  hidden lg:block'
      >
        <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
          <div className='w-10 rounded-full'>
            <Image
              src={
                userInfo.image ||
                `https://ui-avatars.com/api/?uppercase=true&name=${userInfo?.name}`
              }
              width={40}
              height={40}
              alt='profile'
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className='mt-3 z-[1] p-2 menu menu-sm dropdown-content bg-base-100 rounded w-44 shadow-xl'
        >
          <li>
            <Link href='/account/profile' className='justify-between'>
              Profile
            </Link>
          </li>

          <li>
            <button onClick={() => handleLogout()}>
              <Link href='/auth/login'>Logout</Link>
            </button>
          </li>
        </ul>
      </div>

      <div className='dropdown lg:hidden'>
        <div
          tabIndex={0}
          role='button'
          className='btn border bg-transparent m-1'
        >
          <FaBars className='text-gray-500 text-2xl' />
        </div>
        <ul
          tabIndex={0}
          className='dropdown-content z-20 menu p-2 bg-base-100 rounded w-52 shadow-xl top-[66px] right-0'
        >
          <li>
            <Link href='/account/profile' className='justify-between'>
              Profile
            </Link>
          </li>

          {menu.map((item: any, i: number) => (
            <Fragment key={i}>
              {!item?.children && (
                <li>
                  <Link href={item.path}>{item.name}</Link>
                </li>
              )}

              {item?.children && (
                <li key={item.name}>
                  <span
                    onClick={() => handleToggle(item)}
                    className='flex justify-between items-center'
                  >
                    <span className='flex justify-start items-center'>
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
          <hr className='my-2' />
          <li>
            <button onClick={() => handleLogout()}>
              <Link
                href='/auth/login'
                className='flex justify-start items-center flex-row gap-x-1 text-red-500'
              >
                <FaPowerOff /> <span>Logout</span>
              </Link>
            </button>
          </li>
        </ul>
      </div>
    </>
  )

  return (
    <div className='flex-none'>
      <ul className='menu menu-horizontal px-1'>
        {!userInfo.id && (
          <li>
            <Link href='/auth/login'>Login</Link>
          </li>
        )}
      </ul>
      {userInfo.id && auth}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })

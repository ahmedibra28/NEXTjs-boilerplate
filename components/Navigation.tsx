'use client'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'

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

                    <ul className='p-2 bg-base-100 rounded z-50 w-44 top-10 right-0'>
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

      <div suppressHydrationWarning={true} className='dropdown dropdown-end'>
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
              <span className='badge'>New</span>
            </Link>
          </li>

          <li>
            <button onClick={() => handleLogout()}>
              <Link href='/auth/login'>Logout</Link>
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

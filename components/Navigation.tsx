'use client'
import useInterval from '@/hooks/useInterval'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navigation = () => {
  const { userInfo } = useUserInfoStore((state) => state)

  const handleLogout = () => {
    useUserInfoStore.getState().logout()
  }

  useInterval()

  return (
    <div className='flex-none'>
      <ul className='menu menu-horizontal px-1'>
        {!userInfo.id && (
          <li>
            <Link href='/auth/login'>Login</Link>
          </li>
        )}
      </ul>
      {userInfo.id && (
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
            className='mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52'
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
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })

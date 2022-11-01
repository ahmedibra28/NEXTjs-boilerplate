import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaSignInAlt, FaPowerOff } from 'react-icons/fa'
import { userInfo } from '../utils/helper'

export interface AuthProps {
  block: boolean
  confirmed: boolean
  email: string
  name: string
  role: string
  token: string
  _id: string
  routes: RouteProps
}
interface RouteProps {
  menu: string
  name: string
  path: string
  sort: number
}

const Logout = () => {
  typeof window !== undefined && localStorage.removeItem('userRole')
  return typeof window !== undefined && localStorage.removeItem('userInfo')
}

const Navigation = () => {
  const logoutHandler = () => {
    Logout()
  }

  const guestItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          {/* <li className='nav-item'>
            <Link href='/auth/register'>
              <a className='nav-link' aria-current='page'>
                <FaUserPlus className='mb-1' /> Register
              </a>
            </Link> 
          </li>
            */}
          <li className='nav-item'>
            <Link href='/auth/login' className='nav-link' aria-current='page'>
              <FaSignInAlt className='mb-1' /> Login
            </Link>
          </li>
        </ul>
      </>
    )
  }

  const menus = () => {
    const dropdownItems = userInfo()?.userInfo?.routes?.map(
      (route: RouteProps) => ({
        menu: route.menu,
        sort: route.sort,
      })
    )

    const menuItems = userInfo()?.userInfo?.routes?.map(
      (route: RouteProps) => route
    )

    const dropdownArray = dropdownItems?.filter(
      (item: RouteProps) => item?.menu !== 'hidden' && item?.menu !== 'normal'
    )

    const uniqueDropdowns = dropdownArray?.reduce((a, b) => {
      var i = a.findIndex((x: RouteProps) => x.menu === b.menu)
      return (
        i === -1 ? a.push({ menu: b.menu, ...b, times: 1 }) : a[i].times++, a
      )
    }, [])

    return {
      uniqueDropdowns: uniqueDropdowns?.sort(
        (a: { sort: number }, b: { sort: number }) => b?.sort - a?.sort
      ),
      menuItems: menuItems?.sort(
        (a: { sort: number }, b: { sort: number }) => b?.sort - a?.sort
      ),
    }
  }

  useEffect(() => {
    menus()
  }, [])

  const authItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          {menus()?.menuItems?.map(
            (menu: RouteProps, index: number) =>
              menu.menu === 'normal' && (
                <li key={index} className='nav-item'>
                  <Link
                    href={menu.path}
                    className='nav-link'
                    aria-current='page'
                  >
                    {menu.name}
                  </Link>
                </li>
              )
          )}

          {menus()?.uniqueDropdowns?.map((item: RouteProps, index: number) => (
            <li key={index} className='nav-item dropdown'>
              <a
                className='nav-link dropdown-toggle'
                href='#'
                id='navbarDropdownMenuLink'
                role='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                {item?.menu === 'profile'
                  ? userInfo()?.userInfo?.name
                  : item?.menu.charAt(0).toUpperCase() +
                    item?.menu.substring(1)}
              </a>
              <ul
                className='dropdown-menu border-0'
                aria-labelledby='navbarDropdownMenuLink'
              >
                {menus() &&
                  menus().menuItems.map(
                    (menu: RouteProps, index: number) =>
                      menu.menu === item?.menu && (
                        <li key={index}>
                          <Link href={menu.path} className='dropdown-item'>
                            {menu.name}
                          </Link>
                        </li>
                      )
                  )}
              </ul>
            </li>
          ))}

          <li className='nav-item'>
            <Link
              href='/auth/login'
              className='nav-link'
              aria-current='page'
              onClick={logoutHandler}
            >
              <FaPowerOff className='mb-1' /> Logout
            </Link>
          </li>
        </ul>
      </>
    )
  }

  return (
    <nav
      className='navbar navbar-expand-md navbar-light bg-light'
      style={{ minHeight: 55 }}
    >
      <div className='container'>
        <Link href='/'>
          <Image
            priority
            width='40'
            height='40'
            src='/favicon.png'
            className='img-fluid brand-logos'
            alt='logo'
          />
        </Link>

        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          {userInfo()?.userInfo ? authItems() : guestItems()}
        </div>
      </div>
    </nav>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })

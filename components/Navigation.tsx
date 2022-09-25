import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaSignInAlt, FaPowerOff } from 'react-icons/fa'
import useAuthHook from '../utils/api/auth'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { userInfo } from '../utils/helper'
// import { Access, UnlockAccess } from '../utils/UnlockAccess'

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

const Navigation = () => {
  const router = useRouter()
  const { postLogout } = useAuthHook()

  const { mutateAsync } = useMutation(postLogout, {
    onSuccess: () => router.push('/auth/login'),
  })

  const logoutHandler = () => {
    mutateAsync()
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
            <Link href='/auth/login'>
              <a className='nav-link' aria-current='page'>
                <FaSignInAlt className='mb-1' /> Login
              </a>
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

    const menuItems = userInfo()?.userInfo?.routes?.map((route) => route)

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
                  <Link href={menu.path}>
                    <a className='nav-link' aria-current='page'>
                      {menu.name}
                    </a>
                  </Link>
                </li>
              )
          )}

          {menus()?.uniqueDropdowns?.map((item: RouteProps) => (
            <li key={item?.menu} className='nav-item dropdown'>
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
                    (menu) =>
                      menu.menu === item?.menu && (
                        <li key={menu._id}>
                          <Link href={menu.path}>
                            <a className='dropdown-item'>{menu.name}</a>
                          </Link>
                        </li>
                      )
                  )}
              </ul>
            </li>
          ))}

          <li className='nav-item'>
            <Link href='/auth/login'>
              <a
                className='nav-link'
                aria-current='page'
                onClick={logoutHandler}
              >
                <FaPowerOff className='mb-1' /> Logout
              </a>
            </Link>
          </li>
        </ul>
      </>
    )
  }

  return (
    <nav className='navbar navbar-expand-md navbar-light bg-light'>
      <div className='container'>
        <Link href='/'>
          <a>
            <Image
              priority
              width='40'
              height='40'
              src='/favicon.png'
              className='img-fluid brand-logos'
              alt='logo'
            />
          </a>
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
          {userInfo() ? authItems() : guestItems()}
        </div>
      </div>
    </nav>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })

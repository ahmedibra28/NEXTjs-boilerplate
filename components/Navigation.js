import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  FaCog,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaPowerOff,
} from 'react-icons/fa'
import useAuthHook from '../utils/api/auth'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { customLocalStorage } from '../utils/customLocalStorage'
// import { Access, UnlockAccess } from '../utils/UnlockAccess'

const Navigation = () => {
  const router = useRouter()
  const { postLogout } = useAuthHook()

  const { mutateAsync } = useMutation(postLogout, {
    onSuccess: () => router.push('/auth/login'),
  })

  const logoutHandler = () => {
    mutateAsync({})
  }

  const userInfo =
    typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(
          typeof window !== 'undefined' && localStorage.getItem('userInfo')
        )
      : null

  const guestItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          <li className='nav-item'>
            <Link href='/auth/register'>
              <a className='nav-link' aria-current='page'>
                <FaUserPlus className='mb-1' /> Register
              </a>
            </Link>
          </li>
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

  const user = () => {
    const userInfo =
      customLocalStorage() &&
      customLocalStorage().userInfo &&
      customLocalStorage().userInfo

    return userInfo
  }

  const menus = () => {
    const dropdownItems =
      customLocalStorage() &&
      customLocalStorage().userAccessRoutes &&
      customLocalStorage().userAccessRoutes.clientPermission &&
      customLocalStorage().userAccessRoutes.clientPermission.map(
        (route) => route.menu
      )

    const menuItems =
      customLocalStorage() &&
      customLocalStorage().userAccessRoutes &&
      customLocalStorage().userAccessRoutes.clientPermission &&
      customLocalStorage().userAccessRoutes.clientPermission.map(
        (route) => route
      )

    const dropdownArray =
      dropdownItems &&
      dropdownItems.filter((item) => item !== 'hidden' && item !== 'normal')

    const uniqueDropdowns = [...new Set(dropdownArray)]

    return { uniqueDropdowns, menuItems }
  }

  menus()

  const authItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          {menus() &&
            menus().menuItems.map(
              (menu) =>
                menu.menu === 'normal' &&
                menu.auth === true && (
                  <li key={menu._id} className='nav-item'>
                    <Link href={menu.path}>
                      <a className='nav-link' aria-current='page'>
                        {menu.name}
                      </a>
                    </Link>
                  </li>
                )
            )}

          {menus() &&
            menus().uniqueDropdowns.map((item) => (
              <li key={item} className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle'
                  href='#'
                  id='navbarDropdownMenuLink'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {item === 'profile'
                    ? user() && user().name
                    : item.charAt(0).toUpperCase() + item.substring(1)}
                </a>
                <ul
                  className='dropdown-menu border-0'
                  aria-labelledby='navbarDropdownMenuLink'
                >
                  {menus() &&
                    menus().menuItems.map(
                      (menu) =>
                        menu.menu === item && (
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
          {userInfo ? authItems() : guestItems()}
        </div>
      </div>
    </nav>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })

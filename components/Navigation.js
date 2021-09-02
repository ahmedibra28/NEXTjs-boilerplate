import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  FaCog,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaPowerOff,
  FaBars,
} from 'react-icons/fa'
import { logout } from '../api/users'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { customLocalStorage } from '../utils/customLocalStorage'
import { Access, UnlockAccess } from '../utils/UnlockAccess'

const Navigation = () => {
  const router = useRouter()
  const { mutateAsync } = useMutation(logout, {
    onSuccess: () => router.push('/login'),
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
            <Link href='/register'>
              <a className='nav-link active' aria-current='page'>
                <FaUserPlus className='mb-1' /> Register
              </a>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='/login'>
              <a className='nav-link active' aria-current='page'>
                <FaSignInAlt className='mb-1' /> Login
              </a>
            </Link>
          </li>
        </ul>
      </>
    )
  }

  const authItems = () => {
    return (
      <>
        <ul className='navbar-nav me-auto'>
          {customLocalStorage() &&
            customLocalStorage().userAccessRoutes &&
            customLocalStorage().userAccessRoutes.route &&
            customLocalStorage().userAccessRoutes.route.map(
              (route) =>
                route.isActive &&
                route.menu === 'Normal' && (
                  <li key={route._id} className='nav-item'>
                    <Link href={route.path}>
                      <a className='nav-link active' aria-current='page'>
                        {route.name}
                      </a>
                    </Link>
                  </li>
                )
            )}
        </ul>
        <ul className='navbar-nav ms-auto'>
          {UnlockAccess(Access.admin) && (
            <li className='nav-item dropdown'>
              <a
                className='nav-link dropdown-toggle'
                href='#'
                id='navbarDropdownMenuLink'
                role='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                <FaCog className='mb-1' /> Admin
              </a>
              <ul
                className='dropdown-menu border-0'
                aria-labelledby='navbarDropdownMenuLink'
              >
                {customLocalStorage() &&
                  customLocalStorage().userAccessRoutes &&
                  customLocalStorage().userAccessRoutes.route &&
                  customLocalStorage().userAccessRoutes.route.map(
                    (route) =>
                      route.isActive &&
                      route.menu === 'Admin' && (
                        <li key={route._id}>
                          <Link href={route.path}>
                            <a className='dropdown-item'>{route.name}</a>
                          </Link>
                        </li>
                      )
                  )}
              </ul>
            </li>
          )}

          <li className='nav-item dropdown'>
            <a
              className='nav-link dropdown-toggle'
              href='#'
              id='navbarDropdownMenuLink'
              role='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <FaUserCircle className='mb-1' />{' '}
              {customLocalStorage() &&
                customLocalStorage().userInfo &&
                customLocalStorage().userInfo.name}
            </a>
            <ul
              className='dropdown-menu border-0'
              aria-labelledby='navbarDropdownMenuLink'
            >
              <li>
                <Link href='/profile'>
                  <a className='dropdown-item'>
                    <FaUserCircle className='mb-1' /> Profile
                  </a>
                </Link>
              </li>

              <li>
                <Link href='/'>
                  <a className='dropdown-item' onClick={logoutHandler}>
                    <FaPowerOff className='mb-1' /> Logout
                  </a>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </>
    )
  }

  return (
    <nav className='navbar navbar-expand-sm navbar-light shadow-lg'>
      <div className='container'>
        <span className='navbar-brand'>
          {userInfo && (
            <FaBars
              className='mb-1 me-3'
              data-bs-toggle='offcanvas'
              data-bs-target='#offcanvasWithBackdrop'
              aria-controls='offcanvasWithBackdrop'
            />
          )}
        </span>

        <Link href='/'>
          <a className='navbar-brand'>NEXT.js</a>
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

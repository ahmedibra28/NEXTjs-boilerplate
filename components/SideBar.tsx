import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaLink, FaCogs, FaHome, FaUserCog } from 'react-icons/fa'
import apiHook from '../api'
import { userInfo } from '../api/api'
import { IClientPermission } from '../models/ClientPermission'

const SideBar = () => {
  const [show, setShow] = useState(null)
  const router = useRouter()

  useEffect(() => {
    typeof document !== 'undefined' && setShow(userInfo().userInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const menus = () => {
    let dropdownItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => ({
        menu: route.menu,
        sort: route.sort,
      })
    )
    dropdownItems = dropdownItems?.filter(
      (item: IClientPermission) => item?.menu !== 'profile'
    )

    const menuItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => route
    )

    const dropdownArray = dropdownItems?.filter(
      (item: IClientPermission) =>
        item?.menu !== 'hidden' && item?.menu !== 'normal'
    )

    const uniqueDropdowns = dropdownArray?.reduce((a: any[], b: any) => {
      const i = a.findIndex((x: IClientPermission) => x.menu === b.menu)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getApi = apiHook({
    key: ['organization'],
    method: 'GET',
    url: `organization`,
  })?.get

  const menuIcon = (menu: string) => {
    switch (menu) {
      case 'admin':
        return (
          <span className="text-muted">
            <FaUserCog className="mb-1 me-2" />{' '}
            {menu.charAt(0).toUpperCase() + menu.substring(1)}
          </span>
        )
      case 'setting':
        return (
          <span className="text-muted">
            <FaCogs className="mb-1 me-2" />{' '}
            {menu.charAt(0).toUpperCase() + menu.substring(1)}
          </span>
        )
      case 'Home':
        return (
          <span className="text-muted">
            <FaHome className="mb-1 me-2" />{' '}
            {menu.charAt(0).toUpperCase() + menu.substring(1)}
          </span>
        )

      default:
        return (
          <span className="text-muted">
            <FaLink className="mb-1 me-2" />{' '}
            {menu.charAt(0).toUpperCase() + menu.substring(1)}
          </span>
        )
    }
  }

  const authItems = () => {
    return (
      <>
        {menus()?.menuItems?.map(
          (menu: IClientPermission, index: number) =>
            menu.menu === 'normal' && (
              <div
                key={index}
                className="p-2 border border-top-0 border-start-0 border-end-0 shadow-none ps-3"
              >
                <Link
                  href={menu.path}
                  className="text-decoration-none text-primary text-muted fs-6"
                >
                  {menuIcon(menu?.name)}
                </Link>
              </div>
            )
        )}

        {menus()?.uniqueDropdowns?.map(
          (item: IClientPermission, index: number) => (
            <div key={index} className="accordion-item border-0 shadow-none ">
              <div className="accordion-header" id={`dropDownHeading${index}`}>
                <button
                  className="accordion-button shadow-none border border-top-0 border-start-0 border-end-0 bg-light py-2"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#dropDownCollapse${index}`}
                  aria-expanded="true"
                  aria-controls={`dropDownCollapse${index}`}
                >
                  {menuIcon(item?.menu)}
                </button>
              </div>
              <div
                id={`dropDownCollapse${index}`}
                className="accordion-collapse collapse "
                aria-labelledby={`dropDownHeading${index}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body list-group p-0">
                  {menus() &&
                    menus().menuItems.map(
                      (menu: IClientPermission, index: number) =>
                        menu.menu === item?.menu && (
                          <li
                            key={index}
                            className="list-group-item border-top-0 border-start-0 border-end-0 rounded-0 ps-5"
                          >
                            <Link
                              href={menu.path}
                              style={{ overflow: 'hidden' }}
                              className="text-decoration-none text-primary text-muted"
                            >
                              <FaLink className="mb-1 me-2" /> {menu.name}
                            </Link>
                          </li>
                        )
                    )}
                </div>
              </div>
            </div>
          )
        )}
      </>
    )
  }

  return (
    <div
      className="bg-light position-fixed h-100 sidebar"
      style={{
        minWidth: 220,
        top: 55,
        overflowY: 'auto',
        paddingBottom: 80,
      }}
    >
      <div className="p-3" style={{ maxWidth: 220 }}>
        <div className="rounded-pill text-center">
          <Link href="/">
            {getApi?.data?.image ? (
              <Image
                priority
                width={80}
                height={80}
                src={getApi?.data?.image}
                className="img-fluid rounded-pill shadow p-3 border border-primary"
                alt="logo"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Image
                priority
                width={80}
                height={80}
                src="/favicon.png"
                className="img-fluid rounded-pill shadow p-3 border border-primary"
                style={{ objectFit: 'cover' }}
                alt="logo"
              />
            )}
          </Link>
        </div>
        <h1 className="text-wrap text-center fs-6 fw-bold text-uppercase my-1 font-monospace text-primary">
          {getApi?.data?.name?.slice(0, 50) || `ahmedibra.com`}
        </h1>
        <hr />
      </div>

      <div style={{ maxWidth: 220, fontSize: '90%' }}>
        <div className="accordion" id="accordionExample">
          {show && authItems()}
        </div>
      </div>
    </div>
  )
}

export default SideBar

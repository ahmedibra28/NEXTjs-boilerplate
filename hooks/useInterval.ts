'use client'

import useUserInfoStore from '@/zustand/userStore'
import { useEffect, useState } from 'react'
import { baseUrl } from './useApi'
import axios from 'axios'

export default function useInterval() {
  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)
  const [permissions, setPermissions] = useState({
    routes: userInfo?.routes || [],
    menu: userInfo?.menu || [],
  })

  const fetchData = async () => {
    const { data } = await axios.get(`${baseUrl}/users/${userInfo?.id}`)
    setPermissions({
      routes: data?.routes || userInfo?.routes,
      menu: data?.menu || userInfo?.menu,
    })
    return await data
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userInfo?.token) fetchData()
    }, 120000) // check every 60 seconds
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // add userInfo.token as dependency

  useEffect(() => {
    updateUserInfo({
      ...userInfo,
      ...permissions,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions])

  return { token: userInfo?.token }
}

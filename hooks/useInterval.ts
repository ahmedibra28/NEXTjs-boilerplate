'use client'

import useUserInfoStore from '@/zustand/userStore'
import { useEffect } from 'react'
import { baseUrl } from './useApi'
import axios from 'axios'

export default function useInterval() {
  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const fetchData = async () => {
    const { data } = await axios.get(`${baseUrl}/users/${userInfo?.id}`)

    if (data?.routes?.length > 0 && data?.menu?.length > 0) {
      updateUserInfo({
        ...userInfo,
        ...data,
      })

      return await data
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userInfo?.token) fetchData()
    }, 18000) // check every 60 seconds
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { token: userInfo?.token }
}

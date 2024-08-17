'use client'

import useUserInfoStore from '@/zustand/userStore'
import { useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '@/lib/setting'

export default function useInterval() {
  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const fetchData = async () => {
    const { data } = await axios.get(`${baseUrl}/api/users/${userInfo?.id}`)

    if (data?.routes?.length > 0 && data?.menu?.length > 0) {
      updateUserInfo({
        ...userInfo,
        ...data,
      })

      return await data
    }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (userInfo?.token) await fetchData()
    }, 18000) // check every 60 seconds
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { token: userInfo?.token }
}

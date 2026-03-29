'use client'

import useUserInfoStore from '@/zustand/userStore'
import { useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '@/lib/setting'

export default function useInterval() {
  const { userInfo, updateUserInfo, logout } = useUserInfoStore((state) => state)

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/users/${userInfo?.id}`, {
        withCredentials: true,
      })

      if (data?.routes?.length > 0 && data?.menu?.length > 0) {
        updateUserInfo({
          ...userInfo,
          ...data,
        })

        return await data
      }
    } catch (error: any) {
      const message = String(error?.response?.data?.error || error?.message || '')
        .toLowerCase()

      if (
        message.includes('revoked') ||
        message.includes('invalid') ||
        message.includes('expired') ||
        message.includes('not authorized')
      ) {
        logout()
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (userInfo?.id) await fetchData()
    }, 18000) // check every 60 seconds
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { token: userInfo?.id }
}

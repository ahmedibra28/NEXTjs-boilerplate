'use client'
import useUserInfoStore from '@/zustand/userStore'
import { usePathname } from 'next/navigation'

const useAuthorization = (requiredPermission?: string) => {
  const pathname = usePathname()

  const { userInfo } = useUserInfoStore((state) => state)

  if (
    userInfo.id &&
    requiredPermission &&
    !userInfo?.routes
      ?.map((g: { key: string }) => g.key)
      .includes(requiredPermission)
  ) {
    return '/'
  }

  if (!userInfo.id) {
    return `/auth/login?next=${pathname}`
  }
}

export default useAuthorization

'use client'
import useUserInfoStore from '@/zustand/userStore'
import { usePathname, useParams } from 'next/navigation'

const useAuthorization = () => {
  const pathname = usePathname()
  const params = useParams()

  const { userInfo } = useUserInfoStore((state) => state)

  const param = () => {
    const keys = Object.keys(params)
    const values = Object.values(params)
    let param = pathname
    keys.forEach((k, i) => {
      // @ts-ignore
      param = param.replace(values[i], `[${k}]`)
    })
    return param
  }

  if (
    userInfo.id &&
    !userInfo?.routes?.map((g: { path: string }) => g.path).includes(param())
  ) {
    return '/'
  }

  if (!userInfo.token) {
    return `/auth/login?next=${pathname}`
  }
}

export default useAuthorization

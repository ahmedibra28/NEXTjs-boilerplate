import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserInfo = {
  readonly id?: string
  name: string
  email: string
  token: string | null
  role: string
  mobile: string | null
  permissions?: { key: string; name: string; description?: string | null }[]
  routes: any[]
  menu: any[]
  image?: string
}

type UserInfoStore = {
  userInfo: UserInfo
  updateUserInfo: (userInfo: UserInfo) => void
  logout: () => void
}

const useUserInfoStore = create(
  persist<UserInfoStore>(
    (set) => ({
      userInfo: {
        id: '',
        name: '',
        email: '',
        token: null,
        role: '',
        mobile: null,
        permissions: [],
        routes: [],
        menu: [],
        image: '',
      },
      updateUserInfo: (userInfo) => {
        return set((state) => ({
          userInfo: {
            ...state.userInfo,
            ...userInfo,
          },
        }))
      },
      logout: () => {
        return set((state) => ({
          userInfo: {
            ...state.userInfo,
            id: '',
            name: '',
            email: '',
            token: null,
            role: '',
            mobile: null,
            permissions: [],
            routes: [],
            menu: [],
            image: '',
          },
        }))
      },
    }),
    {
      name: 'userInfo',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useUserInfoStore

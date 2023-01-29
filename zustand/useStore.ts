import { create } from 'zustand'

export const userInfo = () => {
  return {
    userInfo:
      typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(
            typeof window !== 'undefined' &&
              (localStorage.getItem('userInfo') as string | any)
          )
        : null,
  }
}

const useStore = create((set) => ({
  toggler: false,
  userInfo: userInfo()?.userInfo,
  routes: null,

  autoToggler: () =>
    set((state: { toggler: boolean }) => ({ toggler: !state.toggler })),

  login: () =>
    set(() => ({
      toggler: true,
      userInfo: userInfo().userInfo,
    })),

  logout: () =>
    set(() => ({
      toggler: false,
      userInfo: null,
    })),
}))

export default useStore

import { create } from 'zustand'

type ResetStore = {
  reset: boolean
  setReset: (x: boolean) => void
}

const useResetStore = create<ResetStore>((set) => ({
  reset: false,
  setReset: (reset: boolean) => {
    return set(() => ({
      reset: reset,
    }))
  },
}))

export default useResetStore

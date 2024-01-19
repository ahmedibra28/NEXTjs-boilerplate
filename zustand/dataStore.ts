import { create } from 'zustand'

type DataStore = {
  data: { id: string; data: any[] }[]
  setData: (data: { id: string; data: any[] }) => void

  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
}

const useDataStore = create<DataStore>((set) => ({
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => set({ dialogOpen }),

  data: [{ id: '', data: [] }],
  setData: (data: { id: string; data: any[] }) => {
    return set((state) => {
      const newData = state.data.filter((x) => x.id !== data.id)
      return {
        data: [...newData, data],
      }
    })
  },
}))

export default useDataStore

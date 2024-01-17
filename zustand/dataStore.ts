import { create } from 'zustand'

type DataStore = {
  data: { id: string; data: any[] }[]
  setData: (data: { id: string; data: any[] }) => void
}

const useDataStore = create<DataStore>((set) => ({
  data: [{ id: '', data: [] }],
  setData: (data: { id: string; data: any[] }) => {
    return set((state) => {
      // check if id exists in data if remove it and add new data

      const newData = state.data.filter((x) => x.id !== data.id)

      return {
        data: [...newData, data],
      }
    })
  },
}))

export default useDataStore

import React from 'react'
import { create } from 'zustand'

type EditStore = {
  edit: boolean
  setEdit: (x: boolean) => void
}

const useEditStore = create<EditStore>((set) => ({
  edit: false,
  setEdit: (edit: boolean) => {
    return set(() => ({
      edit: edit,
    }))
  },
}))

export default useEditStore

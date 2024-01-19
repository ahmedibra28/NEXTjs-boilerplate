'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { FormButton } from './ui/CustomForm'
import React from 'react'
import useDataStore from '@/zustand/dataStore'

interface Props {
  form: any
  loading?: boolean
  handleSubmit: (data: any) => () => void
  submitHandler: (data: any) => void
  label: string
  height?: string
  width?: string
  edit: boolean
}

const FormView = ({
  form,
  loading,
  handleSubmit,
  submitHandler,
  label,
  height,
  width,
  edit,
}: Props) => {
  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogContent className={`${height} ${width} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>
            {edit ? 'Edit' : 'Add New'} {label}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} method='dialog'>
          {form}
          <DialogFooter className='mt-4 gap-y-2'>
            <DialogClose asChild>
              <Button type='button' variant='secondary' id='dialog-close'>
                Close
              </Button>
            </DialogClose>

            <FormButton
              loading={loading}
              type='submit'
              label={edit ? 'Save edited changes' : 'Save changes'}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FormView

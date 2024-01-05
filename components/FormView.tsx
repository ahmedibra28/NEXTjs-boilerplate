'use client'

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { FormButton } from './ui/CustomForm'
import useEditStore from '@/zustand/editStore'
import React from 'react'

interface Props {
  formCleanHandler: () => void
  form: any
  loading?: boolean
  handleSubmit: (data: any) => () => void
  submitHandler: (data: any) => void
  label: string
  width?: string
}

interface DialogContentsProps {
  children: React.ReactNode
  edit?: boolean
  label: string
  form: React.ReactNode
  handleSubmit: any
  submitHandler: any
  formCleanHandler: any
  loading: boolean
  width?: string
}

const FormView = ({
  formCleanHandler,
  form,
  loading,
  handleSubmit,
  submitHandler,
  label,
  width,
}: Props) => {
  const { edit } = useEditStore((state) => state)

  return (
    <DialogContent className={`${width}`}>
      <DialogHeader>
        <DialogTitle>
          {edit ? 'Edit' : 'Add New'} {label}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitHandler)} method='dialog'>
        {form}
        <DialogFooter className='mt-4 gap-y-2'>
          <DialogClose asChild>
            <Button
              onClick={formCleanHandler}
              type='button'
              variant='secondary'
              id='dialog-close'
            >
              Close
            </Button>
          </DialogClose>

          <FormButton loading={loading} type='submit' label='Save changes' />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default FormView

import { cn } from '@/lib/utils'
import React from 'react'
import { Input, InputProps } from '@/components/ui/input'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form'
import { Button, ButtonProps } from '@/components/ui/button'
import { FaCheck, FaChevronDown, FaSpinner } from 'react-icons/fa6'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface FormButtonProp {
  label: string
  className?: string
  icon?: React.ReactNode
  loading?: boolean
}

export interface FormInputProp {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  minLength?: number
  validate?: boolean
  watch?: UseFormWatch<{ [x: string]: any }>
  showLabel?: boolean
  required?: boolean
  name: string
  label: string
}

export interface FormComboboxProp {
  data: { value: string; label: string }[]
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  showLabel?: boolean
  required?: boolean
  name: string
  label: string
  placeholder?: string
}

export interface FormSelectProp {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  showLabel?: boolean
  required?: boolean
  name: string
  label: string
  data: { value: string; label: string }[]
  placeholder?: string
}

export const FormSelect = ({
  register,
  errors,
  name,
  label,
  showLabel = true,
  required = true,
  data,
  placeholder,
  ...props
}: FormSelectProp) => {
  return (
    <div className='w-full'>
      {label && showLabel && (
        <Label className='label' htmlFor={name}>
          {label}
        </Label>
      )}
      <Select
        {...register(name, {
          required: required && `${label} is required`,
        })}
        {...props}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errors[name] && (
        <span className='text-red-500 text-xs'>
          {(errors[name] as FieldError).message}
        </span>
      )}
    </div>
  )
}

export const FormCombobox = ({
  data,
  register,
  errors,
  showLabel = true,
  required = true,
  name,
  label,
  placeholder,
  ...props
}: FormComboboxProp) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <div className='w-full flex flex-col my-1'>
      {label && showLabel && (
        <Label className='label mb-1' htmlFor={name}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {value
              ? data.find((item) => item.value === value)?.label
              : 'Select item...'}
            <FaChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='p-0'>
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <FaCheck
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const FormInput = ({
  register,
  errors,
  minLength,
  validate,
  watch,
  name,
  label,
  showLabel = true,
  required = true,
  ...props
}: FormInputProp & InputProps) => {
  return (
    <div className='w-full'>
      {label && showLabel && (
        <Label className='label' htmlFor={name}>
          {label}
        </Label>
      )}
      <Input
        {...register(name, {
          required: required && `${label} is required`,
          ...(minLength && {
            minLength: {
              value: minLength,
              message: `${label} must have at least 6 characters long`,
            },
          }),

          ...(validate &&
            watch && {
              validate: (value: string) =>
                value === watch().password || 'The passwords do not match',
            }),

          ...(props.type === 'email' && {
            pattern: {
              value: /\S+@\S+\.+\S+/,
              message: 'Entered value does not match email format',
            },
          }),
        })}
        {...props}
      />
      {errors[name] && (
        <span className='text-red-500 text-xs'>
          {(errors[name] as FieldError).message}
        </span>
      )}
    </div>
  )
}

export const FormTextArea = ({
  register,
  errors,
  minLength,
  validate,
  watch,
  name,
  label,
  showLabel = true,
  required = true,
  ...props
}: FormInputProp & TextareaProps) => {
  return (
    <div className='w-full'>
      {label && showLabel && (
        <Label className='label' htmlFor={name}>
          {label}
        </Label>
      )}
      <Textarea
        {...register(name, {
          required: required && `${label} is required`,
          ...(minLength && {
            minLength: {
              value: minLength,
              message: `${label} must have at least 6 characters long`,
            },
          }),

          ...(validate &&
            watch && {
              validate: (value: string) =>
                value === watch().password || 'The passwords do not match',
            }),
        })}
        {...props}
      />
      {errors[name] && (
        <span className='text-red-500 text-xs'>
          {(errors[name] as FieldError).message}
        </span>
      )}
    </div>
  )
}

export const FormButton = ({
  label,
  className,
  type = 'submit',
  onClick,
  icon,
  loading,
  ...props
}: FormButtonProp & ButtonProps) => {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading ? (
        <FaSpinner className='mr-1 animate-spin' />
      ) : (
        icon && <span className='mr-1'>{icon}</span>
      )}

      {label}
    </Button>
  )
}

import { Input, InputProps } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form'
import { Button, ButtonProps } from './button'
import { FaSpinner } from 'react-icons/fa6'

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

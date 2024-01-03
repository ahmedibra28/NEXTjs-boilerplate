'use client'

import React from 'react'
import AsyncSelect from 'react-select/async'
import { Button } from '@/components/ui/button'
import { FaEllipsis, FaFilePen, FaSpinner, FaTrash } from 'react-icons/fa6'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger } from './ui/dialog'

export interface DynamicFormProps {
  register: any
  placeholder?: string
  errors: any
  name: string
  label?: string
  isRequired?: boolean
  validate?: boolean
  minLength?: boolean
  watch?: any
  data?: any
  value?: string
  format?: any
  hasLabel?: boolean
  max?: number
  setSearch?: (e: string) => void
  setValue?: (e: string, v2: string) => void
  setFile?: (e: any) => void
  edit?: boolean
  multiple?: boolean

  items?: string[]
  item?: string
  onChange?: (val: string) => void
  dropdownValue?: string
  customFormat?: any
  disabled?: boolean
}

export const SelectInput = ({
  data,
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  name,
  isMulti = false,
  selectedOption = () => {},
  onChange = () => {},
  debounce = 2000,
  register,
  errors,
  isRequired = true,
  hasLabel = true,
  label,
  edit,
  value,
}: {
  data: any[]
  isDisabled?: boolean
  isLoading?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  name: string
  debounce?: number
  isMulti?: boolean
  selectedOption?: (selectedOption: any) => void
  onChange?: (inputValue: string) => void
  hasLabel?: boolean
  label?: string
  register?: any
  errors?: any
  isRequired?: boolean
  edit?: boolean
  value?: any
}) => {
  const onFilter = (inputValue: string) => {
    return data?.filter((i: any) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  let timeoutId: any

  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      callback(onFilter(inputValue))
    }, debounce)
  }

  return (
    <>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <AsyncSelect
        onInputChange={(e) => onChange(e)}
        value={value}
        placeholder={`Search ${label?.toLowerCase()}`}
        {...register(name, isRequired && { required: `${label} is required` })}
        cacheOptions={true}
        loadOptions={isLoading ? () => {} : loadOptions}
        onChange={selectedOption}
        className='z-[100] input outline-none rounded-none border border-gray-300 w-full'
        classNamePrefix='select'
        defaultValue={edit ? data?.[0] : null}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name={name}
        options={data}
        isMulti={isMulti}
        styles={{
          container: (provided) => ({
            ...provided,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:focus': {
              outline: 'none',
              border: 'none',
            },
          }),
          control: (provided) => ({
            ...provided,
            marginLeft: '-20px',
            border: 'none',
            width: '100%',
            boxShadow: 'none',
            backgroundColor: 'white',
          }),
        }}
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </>
  )
}

export const InputText = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputTel = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='tel'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputTextArea = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        rows='5'
        cols='30'
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputNumber = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
    max = 100000000000,
    disabled = false,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        {...register(name, isRequired && { required: `${label} is required` })}
        type='number'
        step={0.00001}
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
        max={max}
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputEmail = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    label,
    name,
    hasLabel = true,
    isRequired = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}

      <input
        {...register(name, {
          required: isRequired ? `${label} is required` : null,
          pattern: {
            value: /\S+@\S+\.+\S+/,
            message: 'Entered value does not match email format',
          },
        })}
        type='email'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputPassword = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    watch,
    name,
    label,
    validate = false,
    isRequired = true,
    minLength = false,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, {
          required: isRequired ? `${label} is required` : null,
          minLength: minLength
            ? {
                value: 6,
                message: 'Password must have at least 6 characters',
              }
            : null,
          validate: validate
            ? (value: any) =>
                value === watch().password || 'The passwords do not match'
            : null,
        })}
        type='password'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const DynamicInputSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    data,
    isRequired = true,
    value,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      >
        <option value=''>--- {placeholder} ---</option>
        {data &&
          data.map((d: any) => (
            <option key={d.id} value={d.id}>
              {['warehouse'].includes(name)
                ? // @ts-ignore
                  `${d?.branch?.name} - ${d[value]}`
                : // @ts-ignore
                  d[value]}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const StaticInputSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    data,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      >
        <option value=''>-------</option>
        {data &&
          data.map((d: { id: string; name: string }) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputCheckBox = (args: DynamicFormProps) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className='form-control w-full'>
      <label
        className='label cursor-pointer flex justify-start items-center'
        htmlFor={name}
      >
        <input
          className='checkbox checkbox-primary checkbox-sm'
          type='checkbox'
          id={name}
          {...register(
            name,
            isRequired && { required: `${label} is required` }
          )}
        />

        <span className='label-text ml-2'>{label}</span>
      </label>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputMultipleCheckBox = (args: DynamicFormProps) => {
  const { register, errors, name, data, label, isRequired = true } = args

  return (
    <div className='form-control w-full'>
      <div className='row g-1 mb-3 flex flex-wrap flex-col justify-start'>
        {data &&
          data.map((d: any) => (
            <div key={d.id} className='w-full'>
              <label
                className='label cursor-pointer flex justify-start items-center'
                htmlFor={`flexCheck${d.id}`}
              >
                <input
                  {...register(
                    name,
                    isRequired && { required: `${label} is required` }
                  )}
                  className='checkbox checkbox-primary checkbox-sm'
                  type='checkbox'
                  value={d.id}
                  id={`flexCheck${d.id}`}
                />

                <span className='label-text ml-2'>{d.name}</span>
              </label>
            </div>
          ))}
      </div>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputFile = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    isRequired = true,
    label,
    setFile,
    hasLabel = true,
    multiple = false,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        multiple={multiple}
        {...register(name, isRequired && { required: `${label} is required` })}
        type='file'
        placeholder={placeholder}
        className='file-input file-input-ghost rounded-none border border-gray-300 w-full'
        id='formFile'
        // @ts-ignore
        onChange={(e: any) =>
          // @ts-ignore
          setFile(multiple ? e.target.files : e.target.files[0])
        }
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputDate = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='date'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputAutoCompleteSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    data,
    label,
    isRequired = true,
  } = args

  return (
    <div className='form-control w-full'>
      <label className='label' htmlFor='exampleDataList'>
        {label}
      </label>
      <input
        list='datalistOptions'
        autoComplete='off'
        id='exampleDataList'
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      <datalist id='datalistOptions'>
        <option value=''>-------------</option>
        {data &&
          data.map((d: { id: string; name: string }) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
      </datalist>

      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const DynamicInputSelectNumber = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    data,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      >
        <option value=''>-------</option>

        {[...(Array(data).keys() as any)].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const CustomSubmitButton = ({
  type = 'submit',
  classStyle = 'btn btn-primary opacity-1 rounded-none mt-5 w-full',
  isLoading = false,
  label = 'Submit',
  spinner = 'loading loading-spinner',
  ...args
}) => {
  return (
    <button
      {...args}
      type={type as any}
      className={classStyle}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className='flex items-center gap-2'>
          <span className={spinner}></span>
          loading...
        </span>
      ) : (
        label
      )}
    </button>
  )
}

export const ButtonCircle = ({
  type = 'button',
  className = 'btn btn-sm w-12 h-12 btn-primary rounded-full',
  isLoading = false,
  disabled = false,
  label = '',
  onClick = () => {},
  icon,
  args,
}: {
  icon: any
  type?: string
  className?: string
  isLoading?: boolean
  disabled?: boolean
  label?: string
  onClick?: () => void
  args?: any
}) => {
  return (
    <>
      <Button
        {...args}
        type={type as any}
        onClick={onClick}
        disabled={isLoading || disabled}
        className={className}
      >
        {isLoading ? (
          <FaSpinner className='mr-1 animate-spin' />
        ) : (
          <span className='mr-1'>{icon && icon}</span>
        )}
        {label && label}
      </Button>
    </>
  )
}

export const ActionButton = ({
  editHandler,
  isPending,
  deleteHandler,
  original,
  formChildren,
}: {
  editHandler?: (item: any) => void
  isPending?: boolean
  deleteHandler?: (item: any) => void
  modal?: string
  original?: any
  formChildren?: React.ReactNode
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FaEllipsis className='text-2xl' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {editHandler && (
          <div>
            <Dialog>
              <DialogTrigger>
                <div
                  onClick={() => editHandler(original)}
                  className='h-10 min-w-24 flex justify-start items-center gap-x-1 rounded-lg bg-primary text-white py-2 px-4 mx-2 text-sm'
                >
                  <FaFilePen />
                  Edit
                </div>
              </DialogTrigger>
              {formChildren}
            </Dialog>
          </div>
        )}

        {deleteHandler && (
          <DropdownMenuItem>
            <ButtonCircle
              args={{ size: 'sm' }}
              isLoading={isPending}
              label='Delete'
              onClick={() => deleteHandler(original.id)}
              icon={<FaTrash />}
              className='btn-error justify-start text-white bg-red-500'
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

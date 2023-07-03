'use client'

import classNames from 'classnames'
import { memo, useEffect, useRef, useState } from 'react'

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

  items?: string[]
  item?: string
  onChange?: (val: string) => void
}

// export const AutoCompleteInput = (args: DynamicFormProps) => {
//   const {
//     register,
//     placeholder,
//     errors,
//     name,
//     label,
//     isRequired = true,
//     hasLabel = true,
//     data = [],
//     value,
//     setValue,
//     setSearch,
//     format,
//     edit = true,
//   } = args

//   const [visible, setVisible] = useState(true)
//   const [selectedValue, setSelectedValue] = useState('')

//   useEffect(() => {
//     if (selectedValue !== value) {
//       setVisible(true)
//     }
//     // @ts-ignore
//     setSearch(value)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value])

//   useEffect(() => {
//     if (edit) {
//       setVisible(false)
//     }
//   }, [edit])

//   const selectedItem = (item: string) => {
//     // @ts-ignore
//     setValue(name, item)
//     setSelectedValue(item)
//     setVisible(false)
//   }

//   return (
//     <div className='mb-3 position-relative'>
//       {hasLabel && (
//         <label className='label' htmlFor={name}>
//           {label}
//         </label>
//       )}
//       <input
//         {...register(name, isRequired && { required: `${label} is required` })}
//         type='text'
//         placeholder={placeholder}
//         className='form-control shadow-none specialInput'
//         autoComplete='off'
//       />
//       {visible && value && data?.length > 0 && (
//         <div
//           className='bg-light position-absolute start-0 end-0 animate__animated  animate__fadeIn border border-top-0'
//           style={{ zIndex: 10 }}
//         >
//           <ul className='list-inline px-2 mx-1'>
//             {value &&
//               data?.map((d: any) => (
//                 <li
//                   key={d?.id}
//                   className='border border-top-0 border-start-0 border-end-0 my-1  py-1'
//                   onClick={() => selectedItem(d?.name)}
//                 >
//                   {format(d)}
//                 </li>
//               ))}
//           </ul>
//         </div>
//       )}

//       {errors && errors[name] && (
//         <span className='text-secondary text-sm mt-1'>
//           {errors[name].message}
//         </span>
//       )}
//     </div>
//   )
// }

//we are using dropdown, input and menu component from daisyui
const Autocomplete = (props: DynamicFormProps) => {
  const {
    items = [],
    value,
    onChange,
    register,
    placeholder = 'Type something..',
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
    setValue,
    setSearch,
    format,
    edit = true,
    item: itemProp,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <div
        // use classnames here to easily toggle dropdown open
        className={classNames({
          'dropdown w-full': true,
          'dropdown-open': open,
        })}
        ref={ref}
      >
        <input
          {...register(
            name,
            isRequired && { required: `${label} is required` }
          )}
          type='text'
          className='input rounded-none border border-gray-300 w-full'
          value={value}
          // @ts-ignore
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          tabIndex={0}
        />

        {/* add this part */}
        {items?.length > 0 && (
          <div className='dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md'>
            <ul
              className='menu menu-compact '
              // use ref to calculate the width of parent
              style={{ width: ref.current?.clientWidth }}
            >
              {items?.map((item, index) => {
                return (
                  <li
                    key={index}
                    tabIndex={index + 1}
                    onClick={() => {
                      // @ts-ignore
                      onChange(item[itemProp])
                      setOpen(false)
                      // @ts-ignore
                      setValue(name, item[itemProp])
                    }}
                    className='border-b border-b-base-content/10 w-full'
                  >
                    {/* @ts-ignore */}
                    <button type='button'>{item[itemProp]}</button>
                  </li>
                )
              })}
            </ul>
            {/* add this part */}
          </div>
        )}

        {errors && errors[name] && (
          <span className='text-secondary text-sm mt-1'>
            {errors[name].message}
          </span>
        )}
      </div>
    </>
  )
}
// export as memo but not as default
const m = memo(Autocomplete)
export { m as Autocomplete }

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
        type='number'
        step={0.01}
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
  const { register, placeholder, errors, label, name, hasLabel = true } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}

      <input
        {...register(name, {
          required: `${label} is required`,
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
        <option value=''>-------</option>
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
        type='file'
        placeholder={placeholder}
        className='file-input file-input-ghost rounded-none border border-gray-300 w-full'
        id='formFile'
        // @ts-ignore
        onChange={(e: any) => setFile(e.target.files[0])}
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
}) => {
  return (
    <button type={type as any} className={classStyle} disabled={isLoading}>
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
  classStyle = 'btn btn-sm w-12 h-12 btn-primary rounded-full',
  isLoading = false,
  label = '',
  spinner = 'loading loading-spinner',
  onClick = () => {},
  icon,
  args,
}: {
  icon: any
  type?: string
  classStyle?: string
  isLoading?: boolean
  label?: string
  spinner?: string
  onClick?: () => void
  args?: any
}) => {
  return (
    <button
      {...args}
      type={type as any}
      className={`btn btn-sm ${classStyle}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className='flex items-center gap-2'>
          <span className={spinner}></span>
          loading...
        </span>
      ) : (
        <>
          {icon && icon}
          {label && label}
        </>
      )}
    </button>
  )
}

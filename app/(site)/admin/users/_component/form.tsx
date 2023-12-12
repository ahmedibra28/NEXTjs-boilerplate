import {
  InputCheckBox,
  InputEmail,
  InputPassword,
  InputText,
  SelectInput,
} from '@/components/dForms'
import { IRole } from '@/types'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type Form = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  edit?: boolean
  watch?: any
  setValue: (name: string, value: any) => void
  getRolesApi: any
  reactSelect: { id?: string; value?: string; label?: string }[]
  setReactSelect: (value: any) => void
  setRoleValue: (value: any) => void
}

export const form = ({
  register,
  errors,
  edit,
  watch,
  setValue,
  getRolesApi,
  reactSelect,
  setReactSelect,
  setRoleValue,
}: Form) => [
  <div key={0} className='flex flex-wrap justify-between'>
    <div className='w-full'>
      <InputText
        register={register}
        errors={errors}
        label='Name'
        name='name'
        placeholder='Enter name'
      />
    </div>
    <div className='w-full'>
      <InputEmail
        register={register}
        errors={errors}
        label='Email'
        name='email'
        placeholder='Enter email address'
      />
    </div>
    <div className='w-full'>
      <SelectInput
        debounce={1000}
        name='roleId'
        label='Role'
        edit={edit}
        isLoading={getRolesApi?.isPending}
        register={register}
        errors={errors}
        value={reactSelect?.find((item) => item.id === 'roleId')}
        onChange={(item: string) => setRoleValue(item)}
        selectedOption={(item) => {
          setValue('roleId', item)
          setReactSelect([
            ...reactSelect.filter((item) => item.id !== 'roleId'),
            { ...item, id: 'roleId' },
          ])
        }}
        data={
          getRolesApi?.data?.data?.map((item: IRole) => ({
            value: item.id,
            label: item.name,
          })) || []
        }
      />
    </div>
    <div key={2} className='w-full'>
      <InputPassword
        register={register}
        errors={errors}
        label='Password'
        name='password'
        placeholder='Enter password'
        isRequired={false}
      />
    </div>
    <div className='w-full'>
      <InputPassword
        register={register}
        errors={errors}
        label='Confirm Password'
        name='confirmPassword'
        placeholder='Enter confirm password'
        isRequired={false}
        minLength={true}
        validate={true}
        watch={watch}
      />
    </div>
    <div className='w-full'>
      <InputCheckBox
        register={register}
        errors={errors}
        label='Confirmed'
        name='confirmed'
        isRequired={false}
      />
    </div>
    <div className='w-full'>
      <InputCheckBox
        register={register}
        errors={errors}
        label='Blocked'
        name='blocked'
        isRequired={false}
      />
    </div>
  </div>,
]

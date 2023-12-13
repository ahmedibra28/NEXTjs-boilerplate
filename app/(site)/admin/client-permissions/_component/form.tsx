import { InputNumber, InputText } from '@/components/dForms'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type Form = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export const form = ({ register, errors }: Form) => [
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
      <InputText
        register={register}
        errors={errors}
        label='Menu'
        name='menu'
        placeholder='Enter menu'
      />
    </div>
    <div className='w-full'>
      <InputNumber
        register={register}
        errors={errors}
        label='Sort'
        name='sort'
        placeholder='Enter sort'
      />
    </div>
    <div className='w-full'>
      <InputText
        register={register}
        errors={errors}
        label='Path'
        name='path'
        placeholder='Enter path'
      />
    </div>

    <div className='w-full'>
      <InputText
        register={register}
        errors={errors}
        label='Description'
        name='description'
        isRequired={false}
        placeholder='Description'
      />
    </div>
  </div>,
]

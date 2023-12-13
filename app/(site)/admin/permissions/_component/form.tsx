import { InputText, StaticInputSelect } from '@/components/dForms'
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
    <div className='w-full lg:w-[48%]'>
      <StaticInputSelect
        register={register}
        errors={errors}
        label='Method'
        name='method'
        placeholder='Select method'
        isRequired={false}
        data={[
          { name: 'GET' },
          { name: 'POST' },
          { name: 'PUT' },
          { name: 'DELETE' },
        ]}
      />
    </div>
    <div className='w-full lg:w-[48%]'>
      <InputText
        register={register}
        errors={errors}
        label='Route'
        name='route'
        placeholder='Enter Route'
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

import { InputMultipleCheckBox, InputText } from '@/components/dForms'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type Form = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  uniquePermissions: any
  uniqueClientPermissions: any
}

export const form = ({
  register,
  errors,
  uniquePermissions,
  uniqueClientPermissions,
}: Form) => [
  <div key={0} className='flex flex-wrap justify-between'>
    <div className='w-full mb-5'>
      <InputText
        register={register}
        errors={errors}
        label='Name'
        name='name'
        placeholder='Enter name'
      />
    </div>

    <div className='w-full'>
      {uniquePermissions?.length > 0 &&
        uniquePermissions?.map((g: any, i: number) => (
          <div key={i} className='mb-1'>
            <label className='fw-bold text-uppercase'>
              {uniquePermissions?.length > 0 && Object.keys(g)[0]}
            </label>

            <InputMultipleCheckBox
              register={register}
              errors={errors}
              label={`${uniquePermissions?.length > 0 && Object.keys(g)[0]}`}
              name={`permission-${
                uniquePermissions?.length > 0 && Object.keys(g)[0]
              }`}
              placeholder={`${
                uniquePermissions?.length > 0 && Object.keys(g)[0]
              }`}
              data={
                uniquePermissions?.length > 0 &&
                // @ts-ignore
                Object.values(g)[0]?.map((item: any) => ({
                  name: `${item.method} - ${item.description}`,
                  id: item.id?.toString(),
                }))
              }
              isRequired={false}
            />
          </div>
        ))}
    </div>

    <div className='w-full mb-5'>
      <InputText
        register={register}
        errors={errors}
        label='Description'
        name='description'
        isRequired={false}
        placeholder='Description'
      />
    </div>

    <div className='w-full'>
      {uniqueClientPermissions?.length > 0 &&
        uniqueClientPermissions?.map((g: any, i: number) => (
          <div key={i} className='mb-1'>
            <label className='fw-bold text-uppercase'>
              {uniqueClientPermissions?.length > 0 && Object.keys(g)[0]}
            </label>

            <InputMultipleCheckBox
              register={register}
              errors={errors}
              label={`${
                uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
              }`}
              name={`clientPermission-${
                uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
              }`}
              placeholder={`${
                uniqueClientPermissions?.length > 0 && Object.keys(g)[0]
              }`}
              data={
                uniqueClientPermissions?.length > 0 &&
                // @ts-ignore
                Object.values(g)[0]?.map(
                  (item: {
                    menu: any
                    path: any
                    id: any
                    description: string
                  }) => ({
                    name: `${item.description}`,
                    id: item.id?.toString(),
                  })
                )
              }
              isRequired={false}
            />
          </div>
        ))}
    </div>
  </div>,
]

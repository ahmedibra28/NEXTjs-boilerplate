export const inputText = (args) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={`Enter ${name}`}
        className='form-control'
      />
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputNumber = (args) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='number'
        placeholder={`Enter ${name}`}
        className='form-control'
      />
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputEmail = (args) => {
  const { register, errors, label, name } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, {
          required: `${label} is required`,
          pattern: {
            value: /\S+@\S+\.+\S+/,
            message: 'Entered value does not match email format',
          },
        })}
        type='email'
        placeholder={`Enter ${name}`}
        className='form-control'
      />
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputPassword = (args) => {
  const {
    register,
    errors,
    watch,
    name,
    label,
    validate = false,
    isRequired = true,
    minLength = false,
  } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
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
            ? (value) =>
                value === watch().password || 'The passwords do not match'
            : null,
        })}
        type='password'
        placeholder={`Enter ${name}`}
        className='form-control'
      />
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const dynamicInputSelect = (args) => {
  const { register, errors, name, label, data, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={`Enter ${name}`}
        className='form-control'
      >
        <option value=''>-------</option>
        {data &&
          data.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const staticInputSelect = (args) => {
  const { register, errors, name, data, label, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={`Enter ${name}`}
        className='form-control'
      >
        <option value=''>-------</option>
        {data &&
          data.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputCheckBox = (args) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className='mb-3'>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id={name}
          {...register(
            name,
            isRequired && { required: `${label} is required` }
          )}
        />
        <label className='form-check-label' htmlFor={name}>
          {label}
        </label>
      </div>
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputFile = (args) => {
  const { register, errors, name, isRequired = true, label, setFile } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='file'
        placeholder={`Enter ${name}`}
        className='form-control'
        id='formFile'
        onChange={(e) => setFile(e.target.files[0])}
      />
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputDate = (args) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='date'
        placeholder={`Enter ${name}`}
        className='form-control'
      />
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputText = (args) => {
  const { register, errors, name, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{name}</label>
      <input
        {...register(name, isRequired && { required: `${name} is required` })}
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

export const inputEmail = (args) => {
  const { register, errors, name } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{name}</label>
      <input
        {...register(name, {
          required: `${name} is required`,
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
    screenName,
    validate = false,
    isRequired = true,
    minLength = false,
  } = args

  return (
    <div className='mb-3'>
      <label htmlFor={screenName ? screenName : name}>
        {screenName ? screenName : name}
      </label>
      <input
        {...register(name, {
          required: isRequired ? `${name} is required` : null,
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
  const { register, errors, name, data, isRequired = true } = args

  return (
    <div className='mb-3'>
      <label htmlFor={name}>{name}</label>
      <select
        {...register(name, isRequired && { required: `${name} is required` })}
        type='text'
        placeholder={`Enter ${name}`}
        className='form-control'
      >
        <option value=''>-------</option>
        {data &&
          data.map((d) => (
            <option key={d._id} value={d.name}>
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
  const { register, errors, name, isRequired = true } = args

  return (
    <div className='mb-3'>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id={name}
          {...register(name, isRequired && { required: `${name} is required` })}
        />
        <label className='form-check-label' htmlFor={name}>
          {name}
        </label>
      </div>
      {errors && errors[name] && (
        <span className='text-danger'>{errors[name].message}</span>
      )}
    </div>
  )
}

export interface DynamicFormProps {
  register: any
  placeholder: string
  errors: any
  name: string
  label: string
  isRequired: boolean
  validate: boolean
  minLength: boolean
  watch: any
  data: any
  value: string
  setFile: (e: any) => void
}

export const inputText = (args: DynamicFormProps) => {
  const { register, placeholder, errors, name, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type="text"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputTel = (args: DynamicFormProps) => {
  const { register, placeholder, errors, name, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type="tel"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputTextArea = (args: DynamicFormProps) => {
  const { register, placeholder, errors, name, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <textarea
        rows="5"
        cols="30"
        {...register(name, isRequired && { required: `${label} is required` })}
        type="text"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputNumber = (args: DynamicFormProps) => {
  const { register, placeholder, errors, name, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type="number"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputEmail = (args: DynamicFormProps) => {
  const { register, placeholder, errors, label, name } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, {
          required: `${label} is required`,
          pattern: {
            value: /\S+@\S+\.+\S+/,
            message: 'Entered value does not match email format',
          },
        })}
        type="email"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputPassword = (args: DynamicFormProps) => {
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
  } = args

  return (
    <div className="mb-3">
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
            ? (value: any) =>
                value === watch().password || 'The passwords do not match'
            : null,
        })}
        type="password"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const dynamicInputSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    data,
    isRequired = true,
    value,
  } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type="text"
        placeholder={placeholder}
        className="form-control"
      >
        <option value="">-------</option>
        {data &&
          data.map((d: any) => (
            <option key={d._id} value={d._id}>
              {d[value]}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const staticInputSelect = (args: DynamicFormProps) => {
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
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type="text"
        placeholder={placeholder}
        className="form-control"
      >
        <option value="">-------</option>
        {data &&
          data.map((d: { _id: string; name: string }) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputCheckBox = (args: DynamicFormProps) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id={name}
          {...register(
            name,
            isRequired && { required: `${label} is required` }
          )}
        />
        <label className="form-check-label" htmlFor={name}>
          {label}
        </label>
      </div>
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputMultipleCheckBox = (args: DynamicFormProps) => {
  const { register, errors, name, data, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <div className="row g-1 mb-3">
        {data &&
          data.map((d: any) => (
            <div key={d._id} className="col-12">
              <div className="form-check form-switch">
                <input
                  {...register(
                    name,
                    isRequired && { required: `${label} is required` }
                  )}
                  className="form-check-input"
                  type="checkbox"
                  value={d._id}
                  id={`flexCheck${d._id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`flexCheck${d._id}`}
                >
                  {d.name}
                </label>
              </div>
            </div>
          ))}
      </div>
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputFile = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    isRequired = true,
    label,
    setFile,
  } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type="file"
        placeholder={placeholder}
        className="form-control"
        id="formFile"
        onChange={(e: any) => setFile(e.target.files[0])}
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const inputDate = (args: DynamicFormProps) => {
  const { register, placeholder, errors, name, label, isRequired = true } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type="date"
        placeholder={placeholder}
        className="form-control"
      />
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
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
    <div className="mb-3">
      <label htmlFor="exampleDataList" className="form-label">
        {label}
      </label>
      <input
        list="datalistOptions"
        autoComplete="off"
        id="exampleDataList"
        {...register(name, isRequired && { required: `${label} is required` })}
        type="text"
        placeholder={placeholder}
        className="form-control"
      />
      <datalist id="datalistOptions">
        <option value="">-------------</option>
        {data &&
          data.map((d: { _id: string; name: string }) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
      </datalist>

      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

export const dynamicInputSelectNumber = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    data,
    isRequired = true,
  } = args

  return (
    <div className="mb-3">
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type="text"
        placeholder={placeholder}
        className="form-control"
      >
        <option value="">-------</option>

        {[...(Array(data).keys() as any)].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
      {errors && errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  )
}

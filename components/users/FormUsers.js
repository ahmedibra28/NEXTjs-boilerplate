import { Spinner, Message } from '../../components'
import {
  inputCheckBox,
  inputEmail,
  inputPassword,
  inputText,
} from '../../utils/dynamicForm'

const FormUsers = ({
  edit,
  formCleanHandler,
  isLoading,
  register,
  isError,
  errors,
  watch,
  isLoadingUpdate,
  isLoadingPost,
  handleSubmit,
  submitHandler,
  error,
}) => {
  return (
    <div
      className='modal fade'
      id='userModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='userModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id='userModalLabel'>
              {edit ? 'Edit User' : 'Post User'}
            </h3>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={formCleanHandler}
            ></button>
          </div>
          <div className='modal-body'>
            {isLoading ? (
              <Spinner />
            ) : isError ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <form onSubmit={handleSubmit(submitHandler)}>
                {inputText({
                  register,
                  errors,
                  label: 'Name',
                  name: 'name',
                  placeholder: 'Name',
                })}
                {inputEmail({
                  register,
                  errors,
                  label: 'Email',
                  name: 'email',
                  placeholder: 'Email',
                })}

                {inputPassword({
                  register,
                  errors,
                  label: 'Password',
                  name: 'password',
                  minLength: true,
                  isRequired: false,
                  placeholder: 'Password',
                })}

                {inputPassword({
                  register,
                  errors,
                  watch,
                  name: 'confirmPassword',
                  label: 'Confirm Password',
                  validate: true,
                  minLength: true,
                  isRequired: false,
                  placeholder: 'Confirm Password',
                })}

                {inputCheckBox({
                  register,
                  errors,
                  watch,
                  name: 'confirmed',
                  label: 'Confirmed',
                  isRequired: false,
                  placeholder: 'Confirmed',
                })}

                {inputCheckBox({
                  register,
                  errors,
                  watch,
                  name: 'blocked',
                  label: 'Blocked',
                  isRequired: false,
                  placeholder: 'Blocked',
                })}
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary '
                    data-bs-dismiss='modal'
                    onClick={formCleanHandler}
                  >
                    Close
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary '
                    disabled={isLoadingPost || isLoadingUpdate}
                  >
                    {isLoadingPost || isLoadingUpdate ? (
                      <span className='spinner-border spinner-border-sm' />
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormUsers

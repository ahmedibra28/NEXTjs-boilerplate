import { Spinner, Message } from '..'
import {
  inputCheckBox,
  inputText,
  inputTextArea,
} from '../../utils/dynamicForm'

const FormClientPermissions = ({
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
      id='clientPermissionModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='clientPermissionModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id='clientPermissionModalLabel'>
              {edit ? 'Edit Client Permission' : 'Post Client Permission'}
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
                {inputText({
                  register,
                  errors,
                  label: 'Menu',
                  name: 'menu',
                  placeholder: 'Menu',
                })}
                {inputText({
                  register,
                  errors,
                  label: 'Path',
                  name: 'path',
                  placeholder: 'Path',
                })}

                {inputTextArea({
                  register,
                  errors,
                  label: 'Description',
                  name: 'description',
                  placeholder: 'Description',
                  isRequired: false,
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

export default FormClientPermissions

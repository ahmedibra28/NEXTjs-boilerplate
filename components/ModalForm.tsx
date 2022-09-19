import { Spinner, Message } from '.'
import { dynamicInputSelect } from '../utils/dynamicForm'

const FormUserRoles = ({
  edit,
  formCleanHandler,
  isLoading,
  register,
  isError,
  errors,
  isLoadingUpdate,
  isLoadingPost,
  handleSubmit,
  submitHandler,
  error,
  dataRoles,
  dataUsers,
}) => {
  return (
    <div
      className='modal fade'
      id='userRoleModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex={-1}
      aria-labelledby='userRoleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id='userRoleModalLabel'>
              {edit ? 'Edit UserRole' : 'Post UserRole'}
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
                {dynamicInputSelect({
                  register,
                  errors,
                  label: 'User',
                  name: 'user',
                  placeholder: 'User',
                  value: 'name',
                  data:
                    dataUsers &&
                    dataUsers.data &&
                    dataUsers.data.filter(
                      (user: { confirmed: boolean; blocked: boolean }) =>
                        user.confirmed && !user.blocked
                    ),
                })}

                {dynamicInputSelect({
                  register,
                  errors,
                  label: 'Role',
                  name: 'role',
                  placeholder: 'Role',
                  data: dataRoles && dataRoles.data,
                  value: 'name',
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

export default FormUserRoles

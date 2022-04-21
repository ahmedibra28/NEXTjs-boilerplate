import { Spinner, Message } from '..'
import {
  inputCheckBox,
  inputText,
  staticInputSelect,
  dynamicInputSelect,
  inputTextArea,
  inputMultipleCheckBox,
} from '../../utils/dynamicForm'

const FormRoles = ({
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
  permissionData,
  clientPermissionData,
}) => {
  return (
    <div
      className='modal fade'
      id='roleModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='roleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id='roleModalLabel'>
              {edit ? 'Edit Role' : 'Post Role'}
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

                {inputTextArea({
                  register,
                  errors,
                  label: 'Description',
                  name: 'description',
                  placeholder: 'Description',
                })}

                <div className='border border-secondary p-2'>
                  <label htmlFor='permission'>API Permission</label>
                  {inputMultipleCheckBox({
                    register,
                    errors,
                    label: 'Permission',
                    name: 'permission',
                    placeholder: 'Permission',
                    data:
                      permissionData &&
                      permissionData.map((item) => ({
                        name: `${item.method} - ${item.description}`,
                        _id: item._id,
                      })),
                    isRequired: false,
                  })}
                </div>

                <div className='border border-secondary p-2 mt-2'>
                  <label htmlFor='clientPermission'>Client Permission</label>
                  {inputMultipleCheckBox({
                    register,
                    errors,
                    label: 'Client Permission',
                    name: 'clientPermission',
                    placeholder: 'Client Permission',
                    data:
                      clientPermissionData &&
                      clientPermissionData.map((item) => ({
                        name: `${item.menu} - ${item.path}`,
                        _id: item._id,
                      })),
                    isRequired: false,
                  })}
                </div>

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

export default FormRoles

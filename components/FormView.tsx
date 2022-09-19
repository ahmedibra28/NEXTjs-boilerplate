const FormView = ({
  edit,
  formCleanHandler,
  form,
  isLoadingUpdate,
  isLoadingPost,
  handleSubmit,
  submitHandler,
  modal,
  label,
  modalSize,
}) => {
  return (
    <div
      className='modal fade'
      id={modal}
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex={-1}
      aria-labelledby={`${modal}Label`}
      aria-hidden='true'
    >
      <div className={`modal-dialog ${modalSize}`}>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id={`${modal}Label`}>
              {edit ? `Edit ${label}` : `Post ${label}`}
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
            <form onSubmit={handleSubmit(submitHandler)}>
              {/* {row ? (
                <div className='row'>
                  {form.map((f: any, i: number) => (
                    <div key={i}>{f}</div>
                  ))}
                </div>
              ) : (
                form.map((f: any, i: number) => (
                  <Fragment key={i}>{f}</Fragment>
                ))
              )} */}

              <div className='row'>{form}</div>

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
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormView

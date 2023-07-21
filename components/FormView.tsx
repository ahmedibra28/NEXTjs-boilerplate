'use client'

import { FaPaperPlane, FaCircleXmark } from 'react-icons/fa6'
import { CustomSubmitButton } from './dForms'

interface Props {
  formCleanHandler: () => void
  form: any
  isLoadingUpdate?: boolean
  isLoadingPost?: boolean
  handleSubmit: (data: any) => () => void
  submitHandler: (data: any) => void
  modal: string
  label: string
  modalSize: string
}

const FormView = ({
  formCleanHandler,
  form,
  isLoadingUpdate,
  isLoadingPost,
  handleSubmit,
  submitHandler,
  modal,
  label,
  modalSize,
}: Props) => {
  return (
    // <div
    //   className='modal fade'
    //   id={modal}
    //   data-bs-backdrop='static'
    //   data-bs-keyboard='false'
    //   tabIndex={-1}
    //   aria-labelledby={`${modal}Label`}
    //   aria-hidden='true'
    // >
    //   <div className={`modal-dialog ${modalSize}`}>
    //     <div className='modal-content modal-background'>
    //       <div className='modal-header'>
    //         <h3 className='modal-title ' id={`${modal}Label`}>
    //           {edit ? `Edit ${label}` : `Post ${label}`}
    //         </h3>
    //         <button
    //           type='button'
    //           className='btn-close'
    //           data-bs-dismiss='modal'
    //           aria-label='Close'
    //           onClick={formCleanHandler}
    //         ></button>
    //       </div>
    //       <div className='modal-body'>
    //         <form onSubmit={handleSubmit(submitHandler)}>
    //           <div className='row'>{form}</div>

    //           <div className='modal-footer'>
    //             <button
    //               type='button'
    //               className='btn btn-secondary'
    //               data-bs-dismiss='modal'
    //               onClick={formCleanHandler}
    //             >
    //               <>
    //                 <FaCircleXmark className='mb-1' /> Close
    //               </>
    //             </button>
    //             <button
    //               type='submit'
    //               className='btn btn-primary '
    //               disabled={isLoadingPost || isLoadingUpdate}
    //             >
    //               {isLoadingPost || isLoadingUpdate ? (
    //                 <span className='spinner-border spinner-border-sm' />
    //               ) : (
    //                 <>
    //                   <FaPaperPlane className='mb-1' /> Submit
    //                 </>
    //               )}
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <dialog id={modal} className='modal'>
      <form
        onSubmit={handleSubmit(submitHandler)}
        method='dialog'
        className={`modal-box w-11/12 ${modalSize}`}
      >
        <h3 className='font-bold text-2xl'>{label}</h3>

        <div className='row'>{form}</div>

        <div className='modal-action'>
          <button
            onClick={() => {
              // @ts-ignore
              window[modal].close()
              formCleanHandler()
            }}
            type='button'
            className='btn btn-error text-white'
          >
            <FaCircleXmark className='mb-0.5 text-white' /> Close
          </button>

          <CustomSubmitButton
            isLoading={isLoadingPost || isLoadingUpdate}
            label='Submit'
            type='submit'
            classStyle='btn btn-primary opacity-1 rounded-md'
          />
        </div>
      </form>
    </dialog>
  )
}

export default FormView

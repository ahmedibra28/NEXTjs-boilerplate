import React from 'react'

const FormContainer = ({ children }) => {
  return (
    <div className='container'>
      <div
        className='row d-flex justify-content-center'
        style={{ height: '90vh' }}
      >
        <div className='col-lg-5 col-md-6 col-sm-10 col-12 my-auto shadow-lg p-4 '>
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormContainer

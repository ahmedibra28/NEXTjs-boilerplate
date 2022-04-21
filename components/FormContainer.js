const FormContainer = ({ children }) => {
  return (
    <div className='container'>
      <div
        className='row d-flex justify-content-center'
        style={{ height: '90vh' }}
      >
        <div className='col-lg-5 col-md-8 col-sm-10 col-12 my-auto p-4 bg-light'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormContainer

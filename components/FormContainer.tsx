const FormContainer = ({ children }) => {
  return (
    <div className='container mb-5 pb-5'>
      <div className='row d-flex justify-content-center'>
        <div className='col-lg-5 col-md-8 col-sm-10 col-12 my-auto p-4 bg-light'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormContainer

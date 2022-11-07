import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const FormContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="container">
      <div
        className="row d-flex justify-content-center"
        style={{ minHeight: 'calc(100vh - 150px)' }}
      >
        <div className="col-lg-5 col-md-8 col-sm-10 col-12 my-auto p-4 bg-light">
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormContainer

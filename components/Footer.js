const Footer = () => {
  const date = new Date()
  const currentYear = date.getFullYear()

  return (
    <footer>
      <div className='container text-primary'>
        <div className='row'>
          <div className='col text-center py-3 footer font-monospace'>
            Copyright {currentYear} &copy; All Rights Reserved
            <span id='watermark' className='ms-3' />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

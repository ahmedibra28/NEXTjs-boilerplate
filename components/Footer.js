const Footer = () => {
  const date = new Date()
  const currentYear = date.getFullYear()

  return (
    <footer>
      <hr />
      <div className='container'>
        <div className='row'>
          <div className='col text-center custom-custom-text-primary py-3 footer font-monospace'>
            Copyright {currentYear} &copy; All Rights Reserved
          </div>
        </div>
      </div>

      <div id='watermark'></div>
    </footer>
  )
}

export default Footer

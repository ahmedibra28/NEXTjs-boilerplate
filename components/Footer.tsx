import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="text-primary container-fluid" style={{ minHeight: 55 }}>
      <div className="row ">
        <div className="col text-center py-1 footer font-monospace bg-light my-auto">
          Developed by{' '}
          <a target="_blank" href="https://ahmedibra.com" rel="noreferrer">
            Ahmed Ibrahim
          </a>
          <br />
          <Image src="/logo.png" width="30" height="30" alt="logo" />
        </div>
      </div>
    </footer>
  )
}

export default Footer

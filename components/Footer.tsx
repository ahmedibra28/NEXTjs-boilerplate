import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="text-primary container-fluid" style={{ minHeight: 20 }}>
      <div className="row ">
        <div className="col text-center py-1 footer font-monospace bg-light my-auto text-muted">
          Developed by{' '}
          <a
            className="text-muted"
            target="_blank"
            href="https://ahmedibra.com"
            rel="noreferrer"
          >
            Ahmed Ibrahim
          </a>
          <Image
            className="ms-2"
            src="/logo.png"
            width="20"
            height="20"
            alt="logo"
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer

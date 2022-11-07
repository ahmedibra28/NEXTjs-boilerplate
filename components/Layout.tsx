import Navigation from './Navigation'
import Head from 'next/head'
import Footer from './Footer'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => (
  <div>
    <Head>
      <title>NEXT.JS TS Boilerplate</title>
      <meta property="og:title" content="NEXT.JS TS Boilerplate" key="title" />
    </Head>
    <Navigation />
    <div className="d-flex justify-content-between">
      <main
        className="container py-2"
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        {children}
      </main>
    </div>
    <Footer />
  </div>
)

export default Layout

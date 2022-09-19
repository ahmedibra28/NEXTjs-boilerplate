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
      <title>NEXT.js Boilerplate</title>
      <meta property='og:title' content='NEXT.js Boilerplate' key='title' />
    </Head>
    <Navigation />
    <main className='container py-2' style={{ minHeight: '70vh' }}>
      {children}
    </main>
    <Footer />
  </div>
)

export default Layout

import Navigation from './Navigation'
import Head from 'next/head'
import Footer from './Footer'
import { ReactNode } from 'react'
// import SideBar from './SideBar'

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
    <div className='d-flex justify-content-between'>
      {/* <SideBar /> */}
      <main
        className='container py-2'
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        {children}
      </main>
    </div>
    <Footer />
  </div>
)

export default Layout

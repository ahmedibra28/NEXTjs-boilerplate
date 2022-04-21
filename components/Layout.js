import Navigation from './Navigation'
import Head from 'next/head'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>NEXT.js Boilerplate</title>
        <meta property='og:title' content='NEXT.js Boilerplate' key='title' />
      </Head>
      <Navigation />
      <main className='container py-2'>{children}</main>
      <Footer />
    </>
  )
}

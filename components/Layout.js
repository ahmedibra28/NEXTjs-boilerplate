import Navigation from './Navigation'
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>NEXT.js Boilerplate</title>
        <meta property='og:title' content='NEXT.js Boilerplate' key='title' />
      </Head>
      <Navigation />
      <div className='container'>{children}</div>
    </>
  )
}

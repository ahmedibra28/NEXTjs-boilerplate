import dynamic from 'next/dynamic'
import Head from 'next/head'
import withAuth from '../HOC/withAuth'

function Home() {
  return (
    <div>
      <Head>
        <title>NEXT.js Boilerplate</title>
        <meta property='og:title' content='NEXT.js Boilerplate' key='title' />
      </Head>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })

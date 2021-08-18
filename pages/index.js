import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'

function Home() {
  return <div>Hello World!</div>
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })

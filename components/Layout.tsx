import Navigation from './Navigation'
import Footer from './Footer'
import { ReactNode } from 'react'
import Meta from './Meta'
import SideBar from './SideBar'
import useStore from '../zustand/useStore'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const { toggler, autoToggler } = useStore((state) => state) as {
    toggler: boolean
    autoToggler: () => boolean
  }

  return (
    <div>
      <Meta />
      <Navigation toggle={autoToggler} />
      <div className="d-flex justify-content-between">
        {/* {state.toggler && userInfo()?.userInfo && <SideBar />} */}
        {toggler && <SideBar />}

        <main
          className="container mt-5 py-4"
          style={{
            minHeight: 'calc(100vh - 80px)',
            marginLeft: toggler ? 220 : 'auto',
          }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout

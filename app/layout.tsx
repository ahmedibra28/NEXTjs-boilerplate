import Meta from '@/components/Meta'
import './globals.css'
import { Roboto } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Providers from '@/lib/provider'
// import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import { FaBars } from 'react-icons/fa6'
import Link from 'next/link'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700', '900'],
})

export const metadata = {
  ...Meta({}),
}

const nav = () => (
  <div className='navbar bg-white z-50'>
    <div className='flex-1'>
      <label
        htmlFor='my-drawer-2'
        className='btn btn-ghost drawer-button lg:hidden'
      >
        <FaBars className='text-2xl' />
      </label>
      <Link href='/' className='btn btn-ghost w-24 normal-case text-xl'>
        AI
      </Link>
    </div>
    <Navigation />
  </div>
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' style={{ background: '#f3f4f6' }}>
      <body className={roboto.className} suppressHydrationWarning={true}>
        <Providers>
          {nav()}
          <div className='min-h-[91vh]'>
            <Sidebar>
              <main>{children}</main>
            </Sidebar>
          </div>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}

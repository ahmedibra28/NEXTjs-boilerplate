import Meta from '@/components/Meta'
import './globals.css'
import { Roboto } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Providers from '@/lib/provider'
// import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700', '900'],
})

export const metadata = {
  ...Meta({}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' style={{ background: '#f3f4f6' }}>
      <body className={roboto.className} suppressHydrationWarning={true}>
        <Providers>
          <div className='navbar bg-white z-50 h-[68px]'>
            <div className='flex-1'>
              <Link href='/' className='btn btn-ghost w-24 normal-case text-xl'>
                <Image
                  src='https://ahmedibra.com/logo.png'
                  width={40}
                  height={40}
                  alt='logo'
                  className='rounded'
                />
              </Link>
            </div>
            <Navigation />
          </div>
          <div className='min-h-[91vh] max-w-6xl mx-auto px-2'>
            <main>{children}</main>
          </div>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}

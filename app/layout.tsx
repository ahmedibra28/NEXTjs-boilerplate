import './globals.css'
import { Roboto } from 'next/font/google'
import Navigation from '@/components/navigation'
import Providers from '@/lib/provider'
import Footer from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'
import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'
import { Toaster } from '@/components/ui/toaster'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700', '900'],
})

export const metadata = meta({
  title: `${siteName} - Everything You Need & More!`,
  description: `Find a vast selection of products across various categories at ${siteName}. From electronics and clothing to furniture and fresh produce, we offer everything you need for your home and lifestyle.`,
  openGraphImage: logo,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${roboto.className} bg-gray-100`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className='navbar z-50 h-[68px] flex justify-between items-center bg-white px-5'>
            <div>
              <Link href='/' className='w-24 normal-case text-xl'>
                <Image
                  src='https://github.com/ahmedibra28.png'
                  width={40}
                  height={40}
                  alt='logo'
                  className='rounded'
                />
              </Link>
            </div>
            <Navigation />
          </div>
          <div className='max-w-6xl mx-auto px-2'>
            <main className='flex min-h-[85.5vh] flex-col'>{children}</main>
            <Toaster />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

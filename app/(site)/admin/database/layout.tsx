import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Databases',
  description: `List of databases at ${siteName}.`,
  openGraphImage: logo,
})

export default function DatabasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='mx-auto px-2 container'>{children}</div>
}

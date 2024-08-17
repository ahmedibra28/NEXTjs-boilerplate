import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Register',
  description: `Register at ${siteName}.`,
  openGraphImage: logo,
})

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

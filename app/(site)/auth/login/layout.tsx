import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Login',
  description: `Login at ${siteName}.`,
  openGraphImage: logo,
})

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

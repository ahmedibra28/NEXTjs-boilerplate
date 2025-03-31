import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Forgot password',
  description: `Forgot password at ${siteName}.`,
  openGraphImage: logo,
})

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='mx-auto px-2 container'>{children}</div>
}

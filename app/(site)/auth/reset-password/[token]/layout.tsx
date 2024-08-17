import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Reset password',
  description: `Reset password at ${siteName}.`,
  openGraphImage: logo,
})

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

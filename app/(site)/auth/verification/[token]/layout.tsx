import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Account verification',
  description: `Account verification at ${siteName}.`,
  openGraphImage: logo,
})

export default function AccountVerificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Client Permissions',
  description: `List of client permissions at ${siteName}.`,
  openGraphImage: logo,
})

export default function ClientPermissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

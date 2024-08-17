import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Permissions',
  description: `List of permissions at ${siteName}.`,
  openGraphImage: logo,
})

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

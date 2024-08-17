import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Roles',
  description: `List of roles at ${siteName}.`,
  openGraphImage: logo,
})

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

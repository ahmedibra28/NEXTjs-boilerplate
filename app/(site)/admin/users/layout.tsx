import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: 'Users',
  description: `List of users at ${siteName}.`,
  openGraphImage: logo,
})

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

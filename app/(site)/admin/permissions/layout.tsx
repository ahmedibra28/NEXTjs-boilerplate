import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Permissions',
  }),
}

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

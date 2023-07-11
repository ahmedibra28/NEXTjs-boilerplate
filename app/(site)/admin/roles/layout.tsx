import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Roles',
  }),
}

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

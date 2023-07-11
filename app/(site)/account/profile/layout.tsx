import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Profile',
  }),
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

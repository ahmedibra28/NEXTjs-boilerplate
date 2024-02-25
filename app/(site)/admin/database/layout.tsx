import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Database',
  }),
}

export default function DatabaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

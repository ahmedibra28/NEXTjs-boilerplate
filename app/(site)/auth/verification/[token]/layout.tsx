import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Account Verification',
  }),
}

export default function AccountVerificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

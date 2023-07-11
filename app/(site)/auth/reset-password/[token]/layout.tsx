import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Reset Password',
  }),
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

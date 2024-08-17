const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `${BASE_URL}/`
    : 'http://localhost:3000/'

export const siteName = 'Boilerplate'

export const logo = '/logo.svg'

export const siteDescription =
  'Boilerplate is a starter template for building full-stack applications with Next.js, Prisma, and Tailwind CSS.'

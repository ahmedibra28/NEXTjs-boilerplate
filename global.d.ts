import { NextRequest } from 'next/server'
import { PrismaClient } from './prisma/generated/client'

declare global {
  var prisma: PrismaClient
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      DATABASE_URI: string
      BETTER_AUTH_SECRET: string
      BETTER_AUTH_URL: string
      SMTP_SERVER: string
      SMTP_PORT: number
      SMTP_USER: string
      SMTP_KEY: string
    }
  }
  interface NextApiRequestExtended extends Request {
    user?: {
      id: string
      name: string
      email: string
      mobile: string | null
      role: string
      permissions: string[]
      clientPermissions: string[]
    }
    url: string
    method: 'GET' | 'POST' | 'DELETE' | 'PUT'
    query: {
      limit: string
      page: string
      q: string
      id: string
      secret: string
      type: string
      option: string
    }
  }
  interface NextApiResponseExtended extends NextRequest {
    Data: any
  }

  type AuthenticatedRequest = Request & {
    user?: {
      id: string
      name: string
      email: string
      mobile: string | null
      role: string
      permissions: string[]
      clientPermissions: string[]
    }
  }
}

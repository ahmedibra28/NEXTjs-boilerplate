import { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from './models/User'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

declare global {
  var mongoose: any
  var prisma: PrismaClient
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      MONGO_URI: string
      JWT_SECRET: string
      SMTP_SERVER: string
      SMTP_PORT: number
      SMTP_USER: string
      SMTP_KEY: string
    }
  }
  interface NextApiRequestExtended extends Request {
    user: {
      id: string
      name: string
      email: string
      role: string
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
}

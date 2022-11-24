import { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from './models/User'

declare global {
  // eslint-disable-next-line no-var
  var mongoose: any
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
  interface NextApiRequestExtended extends NextApiRequest {
    user: IUser
    url: any
    // method: GET | POST | DELETE | PUT
    files: { file: string }
    query: {
      limit: string
      page: string
      q: string
      id: string
      secret: string
      type: string
    }
  }
  interface NextApiResponseExtended extends NextApiResponse {
    Data: any
  }
}

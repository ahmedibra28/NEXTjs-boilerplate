import jwt from 'jsonwebtoken'
import { getEnvVariable } from './helpers'
import { NextResponse } from 'next/server'
import { prisma } from './prisma.db'

interface JwtPayload {
  id: string
  iat: number
  exp: number
}

export const isAuth = async (req: any, params?: { id: string }) => {
  let token: string = ''

  if (req.headers.get('Authorization')?.startsWith('Bearer')) {
    try {
      token = req.headers.get('Authorization')?.substring(7) as string

      const JWT_SECRET = getEnvVariable('JWT_SECRET')

      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

      const userRole = await prisma.user.findFirst({
        where: {
          id: decoded.id,
        },
        include: {
          role: {
            select: {
              type: true,
              permissions: {
                select: {
                  method: true,
                  route: true,
                },
              },
            },
          },
        },
      })

      req.user = {
        id: userRole?.id,
        name: userRole?.name,
        email: userRole?.email,
        mobile: userRole?.mobile,
        role: userRole?.role.type,
      }

      const permissions = userRole?.role?.permissions

      let { url, method } = req
      url = `/api/${url.split('/api/')[1]}`

      if (params?.id) {
        // api/path/:id
        const removedIDFromURL = url.replace(params?.id, ':id')
        url = removedIDFromURL.split('?')?.[0]
      }

      if (url.includes('?')) {
        // api/path
        url = url.split('?')?.[0]
      }

      if (
        permissions?.find(
          (permission) =>
            permission.route === url && permission.method === method
        )
      ) {
        url = req.url
        return NextResponse.next()
      }

      throw {
        message: 'You do not have permission to access this route',
        status: 403,
      }
    } catch ({ message }: any) {
      throw {
        message: message || 'Not authorized, token failed',
        status: 401,
      }
    }
  }
  if (!token) {
    throw {
      message: 'Not authorized, no token',
      status: 401,
    }
  }
}

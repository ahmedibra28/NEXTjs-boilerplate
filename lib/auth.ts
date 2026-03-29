import jwt from 'jsonwebtoken'
import { getEnvVariable } from './helpers'
import { NextResponse } from 'next/server'
import { prisma } from './prisma.db'

interface JwtPayload {
  id: string
  iat: number
  exp: number
}

export const isAuth = async (req: any, permissionKey?: string) => {
  const { searchParams } = new URL(req.url)

  const allowedUrls = ['client-permissions', 'permissions']
  const shortUrl = req.url?.split('?page')?.[0]?.split('/api/')?.[1]

  const pageSize = parseInt(searchParams.get('limit') as string) || 25
  if (pageSize > 300 && !allowedUrls.includes(shortUrl))
    throw {
      message: 'Page limit should be less than or equal to 300',
      status: 400,
    }

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
                  key: true,
                },
              },
            },
          },
        },
      })

      const accessToken = userRole?.accessToken
      if (!accessToken || accessToken !== token) {
        throw {
          message:
            'Your session token is either invalid or has been revoked. Please log in again to continue',
          status: 401,
        }
      }

      req.user = {
        id: userRole?.id,
        name: userRole?.name,
        email: userRole?.email,
        mobile: userRole?.mobile,
        role: userRole?.role.type,
      }

      const permissions = userRole?.role?.permissions

      if (!permissionKey) {
        throw {
          message: 'Permission key is required',
          status: 500,
        }
      }

      if (permissions?.find((permission) => permission.key === permissionKey)) {
        return NextResponse.next()
      }

      throw {
        message: 'You do not have permission to access this action',
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

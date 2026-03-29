import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { customSession } from 'better-auth/plugins'
import { render } from '@react-email/render'
import { prisma } from './prisma.db'
import { baseUrl } from './setting'
import { getDevice } from './getDevice'
import { handleEmailFire } from './email-helper'
import VerifyAccount from '@/emails/VerifyAccount'
import ResetPassword from '@/emails/ResetPassword'
import { encryptPassword, matchPassword } from './helpers'
import { buildClientAccess } from './access-control'

function getAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?uppercase=true&name=${encodeURIComponent(
    name,
  )}&background=random&color=random&size=128`
}

function normalizeStatus(status: string, emailVerified: boolean) {
  if (status === 'INACTIVE') return 'INACTIVE'
  return emailVerified ? 'ACTIVE' : 'PENDING_VERIFICATION'
}

async function getUserAccessBundle(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      mobile: true,
      status: true,
      emailVerified: true,
      role: {
        select: {
          id: true,
          name: true,
          type: true,
          permissions: {
            select: {
              id: true,
              key: true,
              name: true,
              description: true,
            },
            orderBy: {
              name: 'asc',
            },
          },
          clientPermissions: {
            select: {
              id: true,
              key: true,
              name: true,
              description: true,
              menu: true,
              path: true,
              sort: true,
            },
            orderBy: {
              sort: 'asc',
            },
          },
        },
      },
    },
  })

  if (!user || !user.role) return null

  const permissions = user.role.permissions
  const routes = user.role.clientPermissions
  const permissionKeys = permissions.map((permission) => permission.key)
  const navigation = buildClientAccess(routes)
  const effectiveStatus = normalizeStatus(user.status, user.emailVerified)

  return {
    ...user,
    status: effectiveStatus,
    role: user.role,
    permissions,
    clientPermissions: routes,
    permissionKeys,
    clientPermissionKeys: routes.map((permission) => permission.key),
    routes: navigation.routes,
    menu: navigation.menu,
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      mobile: {
        type: 'string',
        required: false,
      },
      bio: {
        type: 'string',
        required: false,
      },
      roleId: {
        type: 'string',
        required: false,
        input: false,
      },
      status: {
        type: 'string',
        required: false,
        defaultValue: 'PENDING_VERIFICATION',
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: async (password) => encryptPassword({ password }),
      verify: async ({ password, hash }) =>
        matchPassword({
          enteredPassword: password,
          password: hash,
        }),
    },
    sendResetPassword: async ({ user, url }, request) => {
      const device = request
        ? await getDevice({
            req: request,
            hasIp: true,
          })
        : {
            clientName: 'Unknown',
            osName: 'Unknown',
            ip: '',
            url: baseUrl,
          }

      void handleEmailFire({
        to: user.email,
        subject: 'Reset Password Request',
        html: render(
          ResetPassword({
            clientName: device.clientName,
            osName: device.osName,
            url,
            company: 'Book Driving',
            ip: device.ip,
          }),
        ),
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      const device = request
        ? await getDevice({
            req: request,
            hasIp: true,
          })
        : {
            clientName: 'Unknown',
            osName: 'Unknown',
            ip: '',
            url: baseUrl,
          }

      void handleEmailFire({
        to: user.email,
        subject: 'Verify your email',
        html: render(
          VerifyAccount({
            clientName: device.clientName,
            osName: device.osName,
            url,
            company: 'Ahmed Ibra',
            ip: device.ip,
          }),
        ),
      })
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        const staffRole = await prisma.role.findUnique({
          where: { type: 'staff' },
          select: { id: true },
        })

        if (!staffRole) {
          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: 'Default staff role is not configured',
          })
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              email: ctx.body?.email?.toLowerCase?.(),
              image: ctx.body?.image || getAvatarUrl(ctx.body?.name || 'User'),
              roleId: staffRole.id,
              status: 'PENDING_VERIFICATION',
            },
          },
        }
      }

      if (ctx.path === '/sign-in/email') {
        const email = ctx.body?.email?.toLowerCase?.()
        if (!email) return

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            status: true,
          },
        })

        if (user?.status === 'INACTIVE') {
          throw new APIError('FORBIDDEN', {
            message: 'User is inactive',
          })
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              email,
            },
          },
        }
      }
    }),
  },
  session: {
    deferSessionRefresh: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const access = await getUserAccessBundle(user.id)

      if (!access) {
        return {
          user,
          session,
        }
      }

      return {
        user: {
          ...user,
          mobile: access.mobile,
          image: access.image || user.image,
          role: access.role.type,
          status: access.status,
          permissions: access.permissions,
          routes: access.routes,
          menu: access.menu,
        },
        session,
      }
    }),
  ],
  trustedOrigins: [baseUrl.replace(/\/$/, '')],
})

export async function isAuth(
  req: AuthenticatedRequest,
  permissionKey?: string,
) {
  const session = await auth.api.getSession({
    headers: req.headers,
    query: {
      disableCookieCache: true,
    },
  })

  if (!session?.user) {
    throw {
      message: 'Not authorized',
      status: 401,
    }
  }

  const access = await getUserAccessBundle(session.user.id)

  if (!access) {
    throw {
      message: 'User not found or role is not configured',
      status: 401,
    }
  }

  if (access.status === 'INACTIVE') {
    throw {
      message: 'User is inactive',
      status: 403,
    }
  }

  req.user = {
    id: access.id,
    name: access.name,
    email: access.email,
    mobile: access.mobile,
    role: access.role.type,
    permissions: access.permissionKeys,
    clientPermissions: access.clientPermissionKeys,
  }

  if (permissionKey && !access.permissionKeys.includes(permissionKey)) {
    throw {
      message: 'You do not have permission to access this action',
      status: 403,
    }
  }

  return access
}

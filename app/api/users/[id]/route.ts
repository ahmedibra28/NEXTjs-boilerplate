import {
  encryptPassword,
  getErrorResponse,
  validatePasswordStrength,
} from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { isAuth } from '@/lib/auth'
import { buildClientAccess } from '@/lib/access-control'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: Request, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, 'users.access.read')

    const role = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        role: {
          select: {
            clientPermissions: {
              select: {
                key: true,
                menu: true,
                sort: true,
                path: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    })

    if (!role?.role) return getErrorResponse('Role not found', 404)

    const routes = role.role.clientPermissions
    const access = buildClientAccess(routes)

    return NextResponse.json({
      routes: access.routes,
      menu: access.menu,
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, 'users.update')

    const { name, status, password, email, roleId } = await req.json()
    if (password) validatePasswordStrength(password)

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        roleId: true,
        status: true,
      },
    })
    if (!existingUser) return getErrorResponse('User not found', 404)

    const role = await prisma.role.findUnique({
      where: { id: roleId || existingUser.roleId || '' },
      select: { id: true },
    })
    if (!role) return getErrorResponse('Role not found', 404)

    const user =
      email &&
      params.id &&
      (await prisma.user.findFirst({
        where: { email: email.toLowerCase(), id: { not: params.id } },
      }))
    if (user) return getErrorResponse('User already exists', 409)

    const shouldRevokeSession =
      Boolean(password) ||
      existingUser.roleId !== role.id ||
      (status && existingUser.status !== status)

    const userObj = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email: email.toLowerCase(),
        emailVerified: status ? status !== 'PENDING_VERIFICATION' : undefined,
        roleId: role.id,
        status,
      },
    })

    if (password) {
      await prisma.account.upsert({
        where: {
          providerId_accountId: {
            providerId: 'credential',
            accountId: params.id,
          },
        },
        update: {
          password: await encryptPassword({ password }),
        },
        create: {
          userId: params.id,
          accountId: params.id,
          providerId: 'credential',
          password: await encryptPassword({ password }),
        },
      })
    }

    if (shouldRevokeSession) {
      await prisma.session.deleteMany({
        where: { userId: params.id },
      })
    }

    if (!userObj) return getErrorResponse('User not found', 404)

    return NextResponse.json({
      userObj,
      message: 'User has been updated successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, 'users.delete')

    const userObj =
      params.id &&
      (await prisma.user.findFirst({
        where: { id: params.id },
        include: {
          role: true,
        },
      }))
    if (!userObj) return getErrorResponse('User not found', 404)

    if (userObj.role?.type === 'owner')
      return getErrorResponse('You cannot delete a super admin', 403)

    await prisma.session.deleteMany({
      where: { userId: userObj.id },
    })

    const userRemove = await prisma.user.delete({
      where: {
        id: userObj.id,
      },
    })

    if (!userRemove) {
      return getErrorResponse('User not removed', 404)
    }

    return NextResponse.json({
      ...userObj,
      message: 'User removed successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

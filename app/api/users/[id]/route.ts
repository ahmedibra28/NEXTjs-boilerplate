import { encryptPassword, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { isAuth } from '@/lib/auth'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { name, confirmed, blocked, password, email, roleId } =
      await req.json()

    const role = await prisma.role.findFirst({ where: { name: roleId } })
    if (!role) return getErrorResponse('Role not found', 404)

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), id: { not: Number(params.id) } },
    })
    if (user) return getErrorResponse('User already exists', 409)

    const userObj = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        name,
        email: email.toLowerCase(),
        confirmed,
        blocked,
        roleId: role.id,
        ...(password && { password: await encryptPassword(password) }),
      },
    })

    if (!userObj) return getErrorResponse('User not found', 404)

    return NextResponse.json({
      userObj,
      message: 'User has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const userObj = await prisma.user.findFirst({
      where: { id: Number(params.id) },
      include: {
        role: {
          select: {
            type: true,
          },
        },
      },
    })
    if (!userObj) return getErrorResponse('User not found', 404)

    if (userObj.role.type === 'SUPER_ADMIN')
      return getErrorResponse('You cannot delete a super admin', 403)

    const userRemove = await prisma.user.delete({
      where: {
        id: userObj.id,
      },
    })

    if (!userRemove) {
      return getErrorResponse('User not removed', 404)
    }

    userObj.password = undefined as any

    return NextResponse.json({
      ...userObj,
      message: 'User removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'
import { NextResponse } from 'next/server'

interface Params {
  params: Promise<{
    id: string
  }>
}

async function revokeAffectedSessions(permissionId: string) {
  const assignments = await prisma.role.findMany({
    where: {
      permissions: {
        some: {
          id: permissionId,
        },
      },
    },
    select: { id: true },
  })

  if (assignments.length === 0) return

  await prisma.session.deleteMany({
    where: {
      user: {
        roleId: {
          in: assignments.map((assignment) => assignment.id),
        },
      },
    },
  })
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params

  try {
    await isAuth(req, 'access.reference.read')

    const { name, key, description } = await req.json()

    const permission = await prisma.permission.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        key: true,
        isSystem: true,
      },
    })

    if (!permission) return getErrorResponse('Permission not found', 404)
    if (permission.isSystem && key?.trim() && key.trim() !== permission.key) {
      return getErrorResponse('System permission keys cannot be changed', 403)
    }

    const normalizedKey = key?.trim() || permission.key
    const existing = await prisma.permission.findFirst({
      where: {
        key: normalizedKey,
        id: { not: permission.id },
      },
      select: { id: true },
    })
    if (existing) return getErrorResponse('Permission key already exists', 409)

    const updated = await prisma.permission.update({
      where: { id: permission.id },
      data: {
        name: name?.trim() || undefined,
        key: normalizedKey,
        description: description?.trim() || null,
      },
    })

    await revokeAffectedSessions(permission.id)

    return NextResponse.json({
      permission: updated,
      message: 'Permission has been updated successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params

  try {
    await isAuth(req, 'access.reference.read')

    const permission = await prisma.permission.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        isSystem: true,
      },
    })

    if (!permission) return getErrorResponse('Permission not found', 404)
    if (permission.isSystem) {
      return getErrorResponse('System permissions cannot be deleted', 403)
    }

    await revokeAffectedSessions(permission.id)

    await prisma.permission.delete({
      where: { id: permission.id },
    })

    return NextResponse.json({
      ...permission,
      message: 'Permission removed successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

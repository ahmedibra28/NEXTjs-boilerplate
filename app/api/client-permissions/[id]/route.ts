import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'
import { NextResponse } from 'next/server'

interface Params {
  params: Promise<{
    id: string
  }>
}

async function revokeAffectedSessions(clientPermissionId: string) {
  const assignments = await prisma.role.findMany({
    where: {
      clientPermissions: {
        some: {
          id: clientPermissionId,
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

    const { name, key, menu, sort, path, description } = await req.json()

    const clientPermission = await prisma.clientPermission.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        key: true,
        isSystem: true,
      },
    })

    if (!clientPermission) {
      return getErrorResponse('Client permission not found', 404)
    }

    if (
      clientPermission.isSystem &&
      key?.trim() &&
      key.trim() !== clientPermission.key
    ) {
      return getErrorResponse('System navigation keys cannot be changed', 403)
    }

    const normalizedKey = key?.trim() || clientPermission.key
    const existing = await prisma.clientPermission.findFirst({
      where: {
        key: normalizedKey,
        id: { not: clientPermission.id },
      },
      select: { id: true },
    })
    if (existing) return getErrorResponse('Navigation key already exists', 409)

    const updated = await prisma.clientPermission.update({
      where: { id: clientPermission.id },
      data: {
        name: name?.trim() || undefined,
        key: normalizedKey,
        menu: menu?.trim() || undefined,
        sort: sort !== undefined ? parseInt(sort, 10) || 0 : undefined,
        path: path?.trim() || undefined,
        description: description?.trim() || null,
      },
    })

    await revokeAffectedSessions(clientPermission.id)

    return NextResponse.json({
      clientPermission: updated,
      message: 'Client permission has been updated successfully',
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

    const clientPermission = await prisma.clientPermission.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        isSystem: true,
      },
    })

    if (!clientPermission) {
      return getErrorResponse('Client permission not found', 404)
    }
    if (clientPermission.isSystem) {
      return getErrorResponse('System navigation permissions cannot be deleted', 403)
    }

    await revokeAffectedSessions(clientPermission.id)

    await prisma.clientPermission.delete({
      where: { id: clientPermission.id },
    })

    return NextResponse.json({
      ...clientPermission,
      message: 'Client permission removed successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

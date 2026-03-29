import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'
import { NextResponse } from 'next/server'

interface Params {
  params: Promise<{
    id: string
  }>
}

const roleInclude = {
  permissions: {
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: 'asc' as const,
    },
  },
  clientPermissions: {
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      path: true,
      menu: true,
      sort: true,
    },
    orderBy: {
      sort: 'asc' as const,
    },
  },
}

function formatRole(role: {
  id: string
  name: string
  type: string
  description: string | null
  createdAt: Date
  permissions: any[]
  clientPermissions: any[]
}) {
  return {
    id: role.id,
    name: role.name,
    type: role.type,
    description: role.description,
    createdAt: role.createdAt,
    permissions: role.permissions,
    clientPermissions: role.clientPermissions,
  }
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params

  try {
    await isAuth(req, 'access.reference.read')

    const { name, description, permissions, clientPermissions } = await req.json()

    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true },
        },
      },
    })

    if (!role) return getErrorResponse('Role not found', 404)

    const [permissionRecords, clientPermissionRecords] = await Promise.all([
      prisma.permission.findMany({
        where: { id: { in: permissions || [] } },
        select: { id: true },
      }),
      prisma.clientPermission.findMany({
        where: { id: { in: clientPermissions || [] } },
        select: { id: true },
      }),
    ])

    const updatedRole = await prisma.$transaction(async (tx) => {
      return tx.role.update({
        where: { id: role.id },
        data: {
          name: name?.trim() || role.name,
          description: description?.trim() || null,
          permissions: {
            set: permissionRecords.map((permission) => ({
              id: permission.id,
            })),
          },
          clientPermissions: {
            set: clientPermissionRecords.map((clientPermission) => ({
              id: clientPermission.id,
            })),
          },
        },
        include: roleInclude,
      })
    })

    if (role.users.length > 0) {
      await prisma.session.deleteMany({
        where: { user: { roleId: role.id } },
      })
    }

    return NextResponse.json({
      role: formatRole(updatedRole),
      message: 'Role has been updated successfully',
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

    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true },
        },
      },
    })

    if (!role) return getErrorResponse('Role not found', 404)
    if (role.type === 'owner' || role.isSystem) {
      return getErrorResponse('System roles cannot be deleted', 403)
    }
    if (role.users.length > 0) {
      return getErrorResponse(
        'You cannot delete a role that is still assigned to users',
        409,
      )
    }

    await prisma.role.delete({
      where: { id: role.id },
    })

    return NextResponse.json({
      ...role,
      message: 'Role removed successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma, Prisma } from '@/lib/prisma.db'
const { QueryMode } = Prisma

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, params)

    const {
      name,
      permissions: permissionRequest,
      clientPermissions: clientPermissionRequest,
      description,
    } = await req.json()

    let type
    let permission = []
    let clientPermission = []
    if (name) type = name?.toUpperCase().trim().replace(/\s+/g, '_')

    if (permissionRequest) {
      if (Array.isArray(permissionRequest)) {
        permission = permissionRequest
      } else {
        permission = [permissionRequest]
      }
    }

    if (clientPermissionRequest) {
      if (Array.isArray(clientPermissionRequest)) {
        clientPermission = clientPermissionRequest
      } else {
        clientPermission = [clientPermissionRequest]
      }
    }

    permission = permission?.filter((per) => per)
    clientPermission = clientPermission?.filter((client) => client)

    const object = await prisma.role.findUnique({
      where: { id: params.id },
    })
    if (!object) return getErrorResponse('Role not found', 400)

    const checkExistence =
      name &&
      type &&
      params.id &&
      (await prisma.role.findFirst({
        where: {
          name: { equals: name, mode: QueryMode.insensitive },
          type: { equals: type, mode: QueryMode.insensitive },
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('Role already exist')

    // prepare for disconnect
    const oldPermissions = await prisma.role.findUnique({
      where: { id: params.id },
      select: {
        permissions: { select: { id: true } },
        clientPermissions: { select: { id: true } },
      },
    })

    await prisma.role.update({
      where: { id: params.id },
      data: {
        name,
        description,
        type,
        permissions: {
          disconnect: oldPermissions?.permissions?.map((pre) => ({
            id: pre.id,
          })),
          connect: permission?.map((pre) => ({ id: pre })),
        },
        clientPermissions: {
          disconnect: oldPermissions?.clientPermissions?.map((client) => ({
            id: client.id,
          })),
          connect: clientPermission?.map((client) => ({ id: client })),
        },
      },
    })

    return NextResponse.json({
      ...object,
      message: 'Role updated successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, params)

    const checkIfSuperAdmin = await prisma.role.findUnique({
      where: { id: params.id },
    })
    if (checkIfSuperAdmin && checkIfSuperAdmin?.type === 'SUPER_ADMIN')
      return getErrorResponse('Role is super admin', 400)

    const object = await prisma.role.delete({
      where: { id: params.id },
    })

    if (!object) return getErrorResponse('Role not found', 404)

    return NextResponse.json({
      ...object,
      message: 'Role deleted successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: AuthenticatedRequest, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, 'client-permissions.update')

    const { name, key, sort, menu, path, description } = await req.json()
    const normalizedKey = key?.trim()?.toLowerCase()
    if (!normalizedKey)
      return getErrorResponse('Client permission key is required', 400)

    const clientPermissionObj = await prisma.clientPermission.findUnique({
      where: { id: params.id },
    })
    if (!clientPermissionObj)
      return getErrorResponse('Client permission not found', 404)

    const checkExistence =
      normalizedKey &&
      params.id &&
      (await prisma.clientPermission.findFirst({
        where: {
          OR: [{ key: normalizedKey }, { path: path.toLowerCase() }],
          id: { not: params.id },
        } as any,
      }))
    if (checkExistence)
      return getErrorResponse('Client permission already exist')

    await prisma.clientPermission.update({
      where: { id: params.id },
      data: {
        name,
        key: normalizedKey,
        sort: Number(sort),
        menu,
        description,
        path: path.toLowerCase(),
      } as any,
    })

    return NextResponse.json({
      ...clientPermissionObj,
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
    await isAuth(req, 'client-permissions.delete')

    const clientPermissionObj = await prisma.clientPermission.delete({
      where: { id: params.id },
    })
    if (!clientPermissionObj)
      return getErrorResponse('Client permission not found', 404)

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission has been removed successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

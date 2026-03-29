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
    await isAuth(req, 'permissions.update')

    const { name, key, description } = await req.json()
    const normalizedKey = key?.trim()?.toLowerCase()
    if (!normalizedKey)
      return getErrorResponse('Permission key is required', 400)

    const permissionObj = await prisma.permission.findUnique({
      where: { id: params.id },
    })

    if (!permissionObj) return getErrorResponse('Permission not found', 404)

    const checkExistence =
      normalizedKey &&
      params.id &&
      (await prisma.permission.findFirst({
        where: {
          key: normalizedKey,
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('Permission already exist')

    await prisma.permission.update({
      where: { id: params.id },
      data: {
        name,
        key: normalizedKey,
        description,
      },
    })

    return NextResponse.json({
      ...permissionObj,
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
    await isAuth(req, 'permissions.delete')

    const permissionObj = await prisma.permission.delete({
      where: { id: params.id },
    })

    if (!permissionObj) return getErrorResponse('Permission not removed', 404)

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission has been removed successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

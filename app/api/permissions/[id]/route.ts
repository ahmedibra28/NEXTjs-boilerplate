import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { name, method, route, description } = await req.json()

    const permissionObj = await prisma.permission.findUnique({
      where: { id: Number(params.id) },
    })

    if (!permissionObj) return getErrorResponse('Permission not found', 404)

    const checkExistence = await prisma.permission.findFirst({
      where: {
        method: method.toUpperCase(),
        route: route.toLowerCase(),
        id: { not: Number(params.id) },
      },
    })
    if (checkExistence) return getErrorResponse('Permission already exist')

    await prisma.permission.update({
      where: { id: Number(params.id) },
      data: {
        name,
        method: method.toUpperCase(),
        description,
        route: route.toLowerCase(),
      },
    })

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const permissionObj = await prisma.permission.delete({
      where: { id: Number(params.id) },
    })

    if (!permissionObj) return getErrorResponse('Permission not removed', 404)

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

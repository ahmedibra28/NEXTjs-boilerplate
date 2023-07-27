import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { name, sort, menu, path, description } = await req.json()

    const clientPermissionObj = await prisma.clientPermission.findUnique({
      where: { id: params.id },
    })
    if (!clientPermissionObj)
      return getErrorResponse('Client permission not found', 404)

    const checkExistence =
      path &&
      params.id &&
      (await prisma.clientPermission.findFirst({
        where: {
          path: path.toLowerCase(),
          id: { not: params.id },
        },
      }))
    if (checkExistence)
      return getErrorResponse('Client permission already exist')

    await prisma.clientPermission.update({
      where: { id: params.id },
      data: {
        name,
        sort: Number(sort),
        menu,
        description,
        path: path.toLowerCase(),
      },
    })

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const clientPermissionObj = await prisma.clientPermission.delete({
      where: { id: params.id },
    })
    if (!clientPermissionObj)
      return getErrorResponse('Client permission not found', 404)

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    const query = q
      ? { name: { contains: q, mode: QueryMode.insensitive } }
      : {}

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.role.findMany({
        where: query,
        include: {
          permissions: true,
          clientPermissions: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.role.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req)

    const {
      name,
      description,
      permissions: permissionRequest,
      clientPermissions: clientPermissionRequest,
    } = await req.json()

    let type
    let permission = []
    let clientPermission = []
    if (name) type = name.toUpperCase().trim().replace(/\s+/g, '_')

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

    const checkExistence =
      name &&
      (await prisma.role.findFirst({
        where: { name: { equals: name, mode: QueryMode.insensitive } },
      }))
    if (checkExistence) return getErrorResponse('Role already exist')

    const object = await prisma.role.create({
      data: {
        name,
        description,
        type,
        permissions: {
          connect: permission?.map((pre) => ({ id: pre })),
        },
        clientPermissions: {
          connect: clientPermission?.map((client) => ({ id: client })),
        },
      },
    })

    return NextResponse.json({
      ...object,
      message: 'Role created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

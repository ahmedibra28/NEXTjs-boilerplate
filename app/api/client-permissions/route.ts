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
      prisma.clientPermission.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.clientPermission.count({ where: query }),
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

    const { name, sort, menu, path, description } = await req.json()

    const checkExistence =
      path &&
      (await prisma.clientPermission.findFirst({
        where: { path: path.toLowerCase() },
      }))
    if (checkExistence)
      return getErrorResponse('Client permission already exist')

    const clientPermissionObj = await prisma.clientPermission.create({
      data: {
        name,
        description,
        sort: Number(sort),
        menu,
        path: path.toLowerCase(),
      },
    })

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

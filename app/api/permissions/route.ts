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
      prisma.permission.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.permission.count({ where: query }),
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

    const { name, method, route, description } = await req.json()

    const checkExistence =
      method &&
      route &&
      (await prisma.permission.findFirst({
        where: {
          method: method.toUpperCase(),
          route: route.toLowerCase(),
        },
      }))
    if (checkExistence) return getErrorResponse('Permission already exist')

    const permissionObj = await prisma.permission.create({
      data: {
        name,
        method: method.toUpperCase(),
        route: route.toLowerCase(),
        description,
      },
    })

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

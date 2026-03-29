import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma, Prisma } from '@/lib/prisma.db'
const { QueryMode } = Prisma

export async function GET(req: AuthenticatedRequest) {
  try {
    await isAuth(req, 'permissions.read')

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    const query = q
      ? {
          OR: [
            { name: { contains: q, mode: QueryMode.insensitive } },
            { key: { contains: q, mode: QueryMode.insensitive } },
          ],
        }
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
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req, 'permissions.create')

    const { name, key, description } = await req.json()
    const normalizedKey = key?.trim()?.toLowerCase()
    if (!normalizedKey)
      return getErrorResponse('Permission key is required', 400)

    const checkExistence =
      normalizedKey &&
      (await prisma.permission.findFirst({
        where: {
          key: normalizedKey,
        },
      }))
    if (checkExistence) return getErrorResponse('Permission already exist')

    const permissionObj = await prisma.permission.create({
      data: {
        name,
        key: normalizedKey,
        description,
      },
    })

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission created successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

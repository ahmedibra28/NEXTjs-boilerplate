import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma, Prisma } from '@/lib/prisma.db'
const { QueryMode } = Prisma

export async function GET(req: AuthenticatedRequest) {
  try {
    await isAuth(req, 'client-permissions.read')

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    const query = q
      ? {
          OR: [
            { name: { contains: q, mode: QueryMode.insensitive } },
            { key: { contains: q, mode: QueryMode.insensitive } },
            { path: { contains: q, mode: QueryMode.insensitive } },
          ],
        }
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
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req, 'client-permissions.create')

    const { name, key, sort, menu, path, description } = await req.json()
    const normalizedKey = key?.trim()?.toLowerCase()
    if (!normalizedKey)
      return getErrorResponse('Client permission key is required', 400)

    const checkExistence =
      normalizedKey &&
      (await prisma.clientPermission.findFirst({
        where: {
          OR: [{ key: normalizedKey }, { path: path.toLowerCase() }],
        } as any,
      }))
    if (checkExistence)
      return getErrorResponse('Client permission already exist')

    const clientPermissionObj = await prisma.clientPermission.create({
      data: {
        name,
        key: normalizedKey,
        description,
        sort: Number(sort),
        menu,
        path: path.toLowerCase(),
      } as any,
    })

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission created successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

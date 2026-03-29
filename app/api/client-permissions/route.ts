import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { prisma, Prisma } from '@/lib/prisma.db'
import { NextResponse } from 'next/server'

const { QueryMode } = Prisma

export async function GET(req: AuthenticatedRequest) {
  try {
    await isAuth(req, 'access.reference.read')

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: QueryMode.insensitive } },
            { key: { contains: q, mode: QueryMode.insensitive } },
            { path: { contains: q, mode: QueryMode.insensitive } },
            { description: { contains: q, mode: QueryMode.insensitive } },
          ],
        }
      : {}

    const [clientPermissions, total] = await Promise.all([
      prisma.clientPermission.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ isSystem: 'desc' }, { sort: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.clientPermission.count({ where }),
    ])

    return NextResponse.json({
      startIndex: total === 0 ? 0 : skip + 1,
      endIndex: skip + clientPermissions.length,
      count: clientPermissions.length,
      page,
      pages: Math.ceil(total / pageSize),
      total,
      data: clientPermissions,
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req, 'access.reference.read')

    const { name, key, menu, sort, path, description } = await req.json()

    if (!name?.trim()) return getErrorResponse('Name is required', 400)
    if (!key?.trim()) return getErrorResponse('Key is required', 400)
    if (!path?.trim()) return getErrorResponse('Path is required', 400)

    const exists = await prisma.clientPermission.findUnique({
      where: { key: key.trim() },
      select: { id: true },
    })
    if (exists) return getErrorResponse('Navigation key already exists', 409)

    const clientPermission = await prisma.clientPermission.create({
      data: {
        name: name.trim(),
        key: key.trim(),
        menu: menu?.trim() || 'normal',
        sort: parseInt(sort, 10) || 0,
        path: path.trim(),
        description: description?.trim() || null,
      },
    })

    return NextResponse.json({
      clientPermission,
      message: 'Client permission has been created successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

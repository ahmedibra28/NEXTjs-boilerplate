import { isAuth } from '@/lib/auth'
import { slugifyRoleType } from '@/lib/access-control'
import { getErrorResponse } from '@/lib/helpers'
import { prisma, Prisma } from '@/lib/prisma.db'
import { NextResponse } from 'next/server'

const { QueryMode } = Prisma

const roleInclude = {
  permissions: {
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: 'asc' as const,
    },
  },
  clientPermissions: {
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      path: true,
      menu: true,
      sort: true,
    },
    orderBy: {
      sort: 'asc' as const,
    },
  },
}

function formatRole(role: {
  id: string
  name: string
  type: string
  description: string | null
  createdAt: Date
  permissions: any[]
  clientPermissions: any[]
}) {
  return {
    id: role.id,
    name: role.name,
    type: role.type,
    description: role.description,
    createdAt: role.createdAt,
    permissions: role.permissions,
    clientPermissions: role.clientPermissions,
  }
}

export async function GET(req: Request) {
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
            { type: { contains: q, mode: QueryMode.insensitive } },
            { description: { contains: q, mode: QueryMode.insensitive } },
          ],
        }
      : {}

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        include: roleInclude,
        skip,
        take: pageSize,
        orderBy: [{ isSystem: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.role.count({ where }),
    ])

    return NextResponse.json({
      startIndex: total === 0 ? 0 : skip + 1,
      endIndex: skip + roles.length,
      count: roles.length,
      page,
      pages: Math.ceil(total / pageSize),
      total,
      data: roles.map(formatRole),
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req, 'access.reference.read')

    const { name, description, permissions, clientPermissions } = await req.json()
    const type = slugifyRoleType(name || '')

    if (!name?.trim()) return getErrorResponse('Name is required', 400)
    if (!type) return getErrorResponse('Invalid role name', 400)

    const existingRole = await prisma.role.findUnique({
      where: { type },
      select: { id: true },
    })
    if (existingRole) {
      return getErrorResponse('A role with this name already exists', 409)
    }

    const [permissionRecords, clientPermissionRecords] = await Promise.all([
      prisma.permission.findMany({
        where: { id: { in: permissions || [] } },
        select: { id: true },
      }),
      prisma.clientPermission.findMany({
        where: { id: { in: clientPermissions || [] } },
        select: { id: true },
      }),
    ])

    const role = await prisma.role.create({
      data: {
        name: name.trim(),
        type,
        description: description?.trim() || null,
        permissions: {
          connect: permissionRecords.map((permission) => ({
            id: permission.id,
          })),
        },
        clientPermissions: {
          connect: clientPermissionRecords.map((clientPermission) => ({
            id: clientPermission.id,
          })),
        },
      },
      include: roleInclude,
    })

    return NextResponse.json({
      role: formatRole(role),
      message: 'Role has been created successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

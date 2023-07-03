import { clientPermissions, permissions, roles, users } from '@/config/data'

import { encryptPassword, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    const option = searchParams.get('option')

    if (!secret || secret !== 'ts')
      return getErrorResponse('Invalid secret', 401)

    // Check duplicate permissions
    permissions.map((p) => {
      if (p.method && p.route) {
        const duplicate = permissions.filter(
          (p2) => p2.method === p.method && p2.route === p.route
        )
        if (duplicate.length > 1) {
          return getErrorResponse(
            `Duplicate permission: ${p.method} ${p.route}`,
            500
          )
        }
      }
    })

    // Delete all existing data if option is reset
    if (option === 'reset') {
      await prisma.user.deleteMany({})
      await prisma.permission.deleteMany({})
      await prisma.clientPermission.deleteMany({})
      await prisma.role.deleteMany({})
    }

    // Create roles or update if exists
    await prisma.$transaction(async (prisma) => {
      await Promise.all(
        roles?.map(
          async (obj) =>
            await prisma.role.upsert({
              where: { id: obj.id },
              update: obj,
              create: obj,
            })
        )
      )
    })

    // Create users or update if exists
    await prisma.user.upsert({
      where: { id: users.id },
      create: {
        ...users,
        password: await encryptPassword({ password: users.password }),
        roleId: 1,
      },
      update: {
        ...users,
        roleId: 1,
        password: await encryptPassword({ password: users.password }),
      },
    })

    const [permissionsObj, clientPermissionsObj, roleObj] = await Promise.all([
      // Create permissions
      await Promise.all(
        permissions?.map(
          async (obj) =>
            await prisma.permission.upsert({
              where: { id: obj.id },
              // @ts-ignore
              update: obj,
              // @ts-ignore
              create: obj,
            })
        )
      ),
      // Create client permissions
      await Promise.all(
        clientPermissions?.map(
          async (obj) =>
            await prisma.clientPermission.upsert({
              where: { id: obj.id },
              update: obj,
              create: obj,
            })
        )
      ),

      // Create roles
      await Promise.all(
        roles?.map(
          async (obj) =>
            await prisma.role.upsert({
              where: { id: obj.id },
              update: {
                ...obj,
                ...(obj.type === 'SUPER_ADMIN' && {
                  permissions: {
                    connect: permissions.map((p) => ({ id: p.id })),
                  },
                }),
                ...(obj.type === 'SUPER_ADMIN' && {
                  clientPermissions: {
                    connect: clientPermissions.map((p) => ({ id: p.id })),
                  },
                }),
              },
              create: {
                ...obj,
                ...(obj.type === 'SUPER_ADMIN' && {
                  permissions: {
                    connect: permissions.map((p) => ({ id: p.id })),
                  },
                }),
                ...(obj.type === 'SUPER_ADMIN' && {
                  clientPermissions: {
                    connect: clientPermissions.map((p) => ({ id: p.id })),
                  },
                }),
              },
            })
        )
      ),
    ])

    await prisma.user.update({
      data: {
        roleId: 1,
      },
      where: { id: users.id },
    })

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: await prisma.user.count({}),
      permissions: permissionsObj.length,
      clientPermissions: clientPermissionsObj.length,
      roles: roleObj.length,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

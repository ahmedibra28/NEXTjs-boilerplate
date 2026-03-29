import { seedUser } from '@/config/seed'
import { encryptPassword, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { syncSystemAccessControl } from '@/lib/access-control'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    const option = searchParams.get('option')

    if (!secret || secret !== 'ts') {
      return getErrorResponse('Invalid secret', 401)
    }

    if (option === 'reset') {
      await prisma.session.deleteMany({})
      await prisma.account.deleteMany({})
      await prisma.address.deleteMany({})
      await prisma.user.deleteMany({})
      await prisma.permission.deleteMany({})
      await prisma.clientPermission.deleteMany({})
      await prisma.role.deleteMany({})
    }

    await syncSystemAccessControl()

    const ownerRole = await prisma.role.findUnique({
      where: { type: seedUser.roleType },
      select: { id: true },
    })

    if (!ownerRole) {
      return getErrorResponse('Owner role is not configured', 500)
    }

    await prisma.user.upsert({
      where: { id: seedUser.id },
      create: {
        id: seedUser.id,
        name: seedUser.name,
        email: seedUser.email,
        emailVerified: true,
        roleId: ownerRole.id,
        status: seedUser.status,
        mobile: seedUser.mobile,
        image: seedUser.image,
        bio: seedUser.bio,
      },
      update: {
        name: seedUser.name,
        email: seedUser.email,
        emailVerified: true,
        roleId: ownerRole.id,
        status: seedUser.status,
        mobile: seedUser.mobile,
        image: seedUser.image,
        bio: seedUser.bio,
      },
    })

    await prisma.account.upsert({
      where: {
        providerId_accountId: {
          providerId: 'credential',
          accountId: seedUser.id,
        },
      },
      create: {
        userId: seedUser.id,
        accountId: seedUser.id,
        providerId: 'credential',
        password: await encryptPassword({ password: seedUser.password }),
      },
      update: {
        password: await encryptPassword({ password: seedUser.password }),
      },
    })

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: await prisma.user.count({}),
      roles: await prisma.role.count({}),
      permissions: await prisma.permission.count({}),
      clientPermissions: await prisma.clientPermission.count({}),
      accounts: await prisma.account.count({}),
      sessions: await prisma.session.count({}),
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

import { isAuth } from '@/lib/auth'
import {
  encryptPassword,
  getErrorResponse,
  validatePasswordStrength,
} from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: Request, props: Params) {
  try {
    const params = await props.params
    await isAuth(req, 'profile.update')

    const {
      name,
      mobile,
      bio,
      image,
      password,
      address: { street, city, state, zipCode, country },
    } = await req.json()

    const object = await prisma.user.findUnique({
      where: { id: params.id },
      include: { address: true },
    })

    if (!object) return getErrorResponse('User profile not found', 404)

    // Validate password if provided
    if (password) {
      validatePasswordStrength(password)
    }

    // Validate required address fields
    if (!street || !city || !country) {
      return getErrorResponse('Street, city and country are required', 400)
    }

    // Update user
    const [user, address] = await prisma.$transaction([
      prisma.user.update({
        where: { id: params.id },
        data: {
          name: name ?? object.name,
          mobile: mobile ?? object.mobile,
          image: image ?? object.image,
          bio: bio ?? object.bio,
        },
      }),
      prisma.address.upsert({
        where: { userId: params.id },
        create: {
          street,
          city,
          state: state ?? null,
          zipCode: zipCode ?? null,
          country,
          userId: params.id,
        },
        update: {
          street,
          city,
          state: state ?? null,
          zipCode: zipCode ?? null,
          country,
        },
      }),
    ])

    if (password) {
      await prisma.account.upsert({
        where: {
          providerId_accountId: {
            providerId: 'credential',
            accountId: params.id,
          },
        },
        update: {
          password: await encryptPassword({ password }),
        },
        create: {
          userId: params.id,
          accountId: params.id,
          providerId: 'credential',
          password: await encryptPassword({ password }),
        },
      })

      await prisma.session.deleteMany({
        where: { userId: params.id },
      })
    }

    return NextResponse.json({
      ...user,
      address,
      message: 'Profile has been updated successfully',
    })
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}

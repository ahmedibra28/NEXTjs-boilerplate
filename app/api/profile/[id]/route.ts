import { isAuth } from '@/lib/auth'
import { encryptPassword, getErrorResponse } from '@/lib/helpers'
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
    await isAuth(req, params)

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
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!regex.test(password)) {
        return getErrorResponse(
          'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character',
          400
        )
      }
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
          ...(password && { password: await encryptPassword({ password }) }),
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
